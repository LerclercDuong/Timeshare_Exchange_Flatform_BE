const UnitModel = require('../../models/units');
const ReservationModel = require("../../models/reservations");
const { uploadToS3 } = require('../../utils/s3Store');

class UnitService {
    async UploadUnitWithS3({
        name,
        roomType,
        kitchenType,
        sleeps,
        bathrooms,
        image,
        features,
        resortId,
        userId
    }) {
        console.log(image);
        const {key} = await uploadToS3({file: image, userId: userId});
        const uploadData = {
            name: name,
            roomType: roomType,
            kitchenType: kitchenType,
            sleeps: sleeps,
            bathrooms: bathrooms,
            image: key,
            features: features,
            resort: resortId
        }
        const newUpload = new UnitModel({...uploadData});
        return newUpload.save().catch();
    }
}

module.exports = new UnitService;
