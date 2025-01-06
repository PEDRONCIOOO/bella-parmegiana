const Options = require("../models/optionsModel");
const handlerFactory = require("./handlerFactory");

exports.getAllOptions = handlerFactory.getAll(Options);
exports.getOptions = handlerFactory.getOne(Options);
exports.createOptions = handlerFactory.createOne(Options);
exports.delteOptions = handlerFactory.deleteOne(Options);
exports.updateOptions = handlerFactory.updateOne(Options);
