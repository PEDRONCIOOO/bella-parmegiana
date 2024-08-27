class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // { difficulty : 'easy' , duration: { $gte : 5 } } QUERY THAT COMES FROM REQUEST
    // { difficulty : 'easy' , duration: { gte : '5' } } QUERY THAT IS USED IN MONGOOSE
    // needs replacing gte, gt, lte, lt
    // Changing the query so that it is accepted by mongoose

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // Sorting by more than one parameter
      const sortBy = this.queryString.sort.split(",").join(" ");
      // Actually applying the sort to the query
      this.query = this.query.sort(sortBy);
    } else {
      //   this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = +this.queryString.page || 1; // Add default page here
    const limit = +this.queryString.limit || 10; // Add default page size here
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
