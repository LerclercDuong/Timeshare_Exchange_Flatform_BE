const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const reservationSchema = new Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        timeshareId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Timeshares',
            required: true,
        },
        requestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Requests',
        },
        type: {
            type: String,
            enum: ['rent', 'exchange'],
            required: true,
        },
        reservationDate: {
            type: Date,
        },
        fullName: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        address: {
            street: {
                type: String,
                // required: true,
            },
            city: {
                type: String,
                // required: true,
            },
            province: {
                type: String,
                // required: true,
            },
            zipCode: {
                type: String,
                // required: true,
            },
            country: {
                type: String,
                // required: true,
            },
        },
        amount: {
            type: Number,
            required: true
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        is_confirmed: {
            type: Boolean,
            default: false,
            required: true
        },
        is_accepted_by_owner: {
            type: Boolean,
            default: false,
            required: true,
        },
        owner_accepted_at: {
            type: Date,
            required: false,
        },
        is_denied_by_owner: {
            type: Boolean,
            default: false,
            required: true,
        },
        is_canceled_by_renter: {
            type: Boolean,
            default: false,
            required: true,
        },
        cancel_reason: {
            type: String,
            default: null,
            required: false
        },
        status: {
            type: String,
            enum: ['Agreement phase', 'Payment phase', 'Finished', 'Canceled', 'Refunded'],
            default: 'Agreement phase',
        },
        pending: {
            type: Boolean,
            require: false,
        },
        confirmed_at: {
            type: Date,
            require: false
        },
        paymentDeadline: {
            type: Date,
            require: false,
            default: null
        },
    }
    , {
        timestamps: true // Add createdAt and updatedAt fields
    });


reservationSchema.plugin(mongooseDelete);

// Middleware to handle when is_accepted_by_owner changes to true
reservationSchema.pre('updateOne', async function (next) {
    const {is_accepted_by_owner} = this.getUpdate().$set;
    if (is_accepted_by_owner) {
        // Update the 'status' field to 'Payment phase'
        this.set({
            status: 'Payment phase',
            owner_accepted_at: new Date(),
            paymentDeadline: (new Date().getTime()) + 36000
        });
    }
    next();
});
reservationSchema.post('updateOne', async function (next) {
    const {paymentDeadline} = this.getUpdate().$set;
    const {status} = this.getUpdate().$set;
    const {is_accepted_by_owner} = this.getUpdate().$set
    const reservationId = this.getQuery()._id;
    const reservation = await Reservation.findOne({_id: reservationId});
    if (is_accepted_by_owner && status !== "Canceled") {
        if (status === 'Payment phase') {
            await Reservation.updateMany(
                {
                    _id: {$ne: reservationId},
                    timeshareId: reservation?.timeshareId?._id,
                    status: {$ne: "Canceled"},
                },
                {
                    $set: {
                        pending: true,
                    },
                }
            );
        }
    }
    if (status === "Canceled" && is_accepted_by_owner) {
        console.log('hello rollback')
        await Reservation.updateMany(
            {
                _id: {$ne: reservationId},
                timeshareId: reservation?.timeshareId?._id,
            },
            {
                $set: {
                    pending: false,
                },
            }
        );
    }
    if (paymentDeadline) {
        if (reservation && reservation.status === 'Payment phase') {
            const paymentDeadlineInMillis = reservation.paymentDeadline.getTime();
            const currentTime = new Date().getTime();
            const delay = Math.max(0, paymentDeadlineInMillis - currentTime);
            setTimeout(async () => {
                const updated = await Reservation.updateOne(
                    {_id: reservationId},
                    {
                        $set: {
                            status: 'Canceled',
                            cancel_reason: 'Payment process timeout'
                        },
                    }
                );
                if(updated){
                    await Reservation.updateMany(
                        {
                            _id: {$ne: reservationId},
                            timeshareId: reservation?.timeshareId?._id,
                        },
                        {
                            $set: {
                                pending: false,
                            },
                        }
                    );
                }
            }, delay);
        }
    }
})
reservationSchema.pre('updateOne', async function (next) {
    const {is_denied_by_owner} = this.getUpdate().$set;
    const {isPaid} = this.getUpdate().$set;
    const {status} = this.getUpdate().$set;
    const {paymentDeadline} = this.getUpdate().$set;
    const reservationId = this.getQuery()._id;
    const reservation = await Reservation.findOne({_id: reservationId});

    if (is_denied_by_owner) {
        this.set({status: 'Canceled', cancel_reason: 'Denied by owner'});
    }

    if (isPaid) {
        this.set({status: 'Finished'});
    }

    if (status === 'Payment phase') {
        await Reservation.updateMany(
            {
                _id: {$ne: reservationId},
                timeshareId: reservation?.timeshareId?._id,
                status: {$ne: "Canceled"},
            },
            {
                $set: {
                    pending: false,
                },
            }
        );
    }
    if (reservation.status === 'Canceled') {
        if (reservation.is_canceled_by_renter) {
            await Reservation.updateOne(
                {_id: reservationId},
                {
                    $set: {
                        cancel_reason: 'Cancel by renter'
                    },
                }
            );
        }
        if (reservation.is_denied_by_owner) {
            await Reservation.updateOne(
                {_id: reservationId},
                {
                    $set: {
                        cancel_reason: 'Denied by owner'
                    },
                }
            );
        }
    }
    next();
});
reservationSchema.pre('save', async function (next) {
    if (this.isNew) {
        const existingPaymentPhaseReservation = await Reservation.findOne({
            timeshareId: this.timeshareId,
            status: 'Payment phase',
        });
        this.pending = !!existingPaymentPhaseReservation;
    }
    next();
});

reservationSchema.pre('find', async function (docs, next) {
    this.populate({
        path: "timeshareId userId"
    })
});
reservationSchema.pre('findOne', async function (docs, next) {
    this.populate({
        path: "timeshareId userId"
    })
});
reservationSchema.path('timeshareId').validate(async function (value) {
    const timeshare = await mongoose.model('Timeshares').findById(value);
    if (timeshare && timeshare?.current_owner.equals(this.userId)) {
        throw new Error('The owner of the timeshare cannot be the same as the reservation user.');
    }
    return true;
}, 'Validation error');

// reservationSchema.index({userId: 1, timeshareId: -1}, {unique: true, dropDups: true});

const Reservation = mongoose.model('Reservations', reservationSchema);

// Set up a MongoDB change stream
// const changeStream = Reservation.watch();
// changeStream.on('change', async (change) => {
//     try {
//         const changeId = change.documentKey._id
//         const changeField = change.updateDescription.updatedFields;
//         if (changeField.status === 'Payment phase') {
//             const reservation = await Reservation.findOne({_id: changeId});
//             await Reservation.updateMany(
//                 {
//                     _id: {$ne: changeId},
//                     timeshareId: reservation.timeshareId._id,
//                     status: {$ne: "Canceled"},
//                 },
//                 {
//                     $set: {
//                         pending: false,
//                     },
//                 }
//             );
//         }
//         if (changeField.status === 'Canceled') {
//             if (changeField.is_canceled_by_renter) {
//                 await Reservation.updateOne(
//                     {_id: changeId},
//                     {
//                         $set: {
//                             cancel_reason: 'Cancel by renter'
//                         },
//                     }
//                 );
//             }
//             if (changeField.is_denied_by_owner) {
//                 await Reservation.updateOne(
//                     {_id: changeId},
//                     {
//                         $set: {
//                             cancel_reason: 'Denied by owner'
//                         },
//                     }
//                 );
//             }
//         }
//         if (change.updateDescription.updatedFields.paymentDeadline) {
//             const reservation = await Reservation.findOne({_id: changeId});
//             if (reservation && reservation.status === 'Payment phase') {
//                 const paymentDeadlineInMillis = reservation.paymentDeadline.getTime();
//                 const currentTime = new Date().getTime();
//                 const delay = Math.max(0, paymentDeadlineInMillis - currentTime);
//                 setTimeout(async () => {
//                     await Reservation.updateOne(
//                         {_id: changeId},
//                         {
//                             $set: {
//                                 status: 'Canceled',
//                                 cancel_reason: 'Payment process timeout'
//                             },
//                         }
//                     );
//                 }, delay);
//             }
//         }
//     } catch (err) {
//         console.log(err.message)
//     }
//
//
// });

module.exports = Reservation;
