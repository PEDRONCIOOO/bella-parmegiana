const multer = require("multer");
const sharp = require("sharp");

const handlerFactory = require("./handlerFactory");
const Recipe = require("../models/recipeModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/features");

// TODO: Change fileName to `recipe-${req.body.name.replaceAll(" ", "")}-${Date.now()}.${ext}` if I want to keep old recipe images

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/recipes");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `recipe-${req.body.name.replaceAll(" ", "-")}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else
    cb(
      new AppError(
        "Arquivo escolhido nao é uma imagem. Por favor escolha um arquivo válido",
        401
      ),
      false
    );
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadRecipeImage = upload.single("image");

exports.resizeRecipeImage = (req, res, next) => {
  if (!req.file) return next();

  next();
};
exports.getPlate = handlerFactory.getOne(Recipe);
exports.updatePlate = handlerFactory.updateOne(Recipe);
exports.deletePlate = handlerFactory.deleteOne(Recipe);

exports.getAllPlates = catchAsync(async (req, res, next) => {
  let query;
  let count;
  if (req.query.categories) {
    query = Recipe.find({
      categories: { $in: JSON.parse(req.query.categories) },
    });
    if (req.query.count)
      count = await Recipe.countDocuments({
        categories: { $in: JSON.parse(req.query.categories) },
      });
  } else {
    query = Recipe.find();
    if (req.query.count) count = await Recipe.countDocuments();
  }
  delete req.query.categories;
  delete req.query.count;

  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;

  if (!doc) return next(new AppError("Nenhum documento encontrado!", 404));

  res.status(200).json({
    status: "success",
    results: doc.length,
    count,
    data: {
      data: doc,
    },
  });
});

exports.createPlate = catchAsync(async (req, res, next) => {
  if (req.file) req.body.image = req.file.filename;
  req.body.options = JSON.parse(req.body.options);
  req.body.categories = req.body.categories.split(",");
  req.body.ingredients = req.body.ingredients.split(",");

  const doc = await Recipe.create(req.body);

  const filename = `recipe-${doc._id}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/recipes/${filename}`);

  const recipe = await Recipe.findByIdAndUpdate(
    doc._id,
    { image: filename },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    data: {
      data: recipe,
    },
  });
});
