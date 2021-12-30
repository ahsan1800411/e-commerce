class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // search functionality
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: 'i',
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  //   filter functionality
  filter() {
    const queryCopy = { ...this.queryStr };

    // remove some fields;
    const removeFields = ['keyword', 'limit', 'page'];
    removeFields.forEach((el) => delete queryCopy[el]);
    // advanded filters for priced and rating,

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
}

module.exports = APIFeatures;
