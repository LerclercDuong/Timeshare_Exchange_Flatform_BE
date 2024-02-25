const dateRangePlugin = (schema) => {
    // Add a static method to the schema
    schema.statics.findByDateRange = function (startDate, endDate) {
        return this.find({
            start_date: {$lte: endDate},
            end_date: {$gte: startDate},
        });
    };
}
module.exports = dateRangePlugin;