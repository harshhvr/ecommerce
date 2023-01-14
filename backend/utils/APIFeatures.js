class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const q = this.queryString.q
      ? {
          name: {
            $regex: this.queryString.q,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...q });
    return this;
  }

  filter() {
    const customQuery = { ...this.queryString };

    // Removing some fields from category
    /**
     * q: query
     * page: page
     * limit: limit
     */
    const removeFields = ["q", "page", "limit"];

    removeFields.forEach((key) => delete customQuery[key]);

    // Filter for Price & Rating
    let customQueryString = JSON.stringify(customQuery);
    customQueryString = customQueryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (key) => `$${key}`
    );

    this.query = this.query.find(JSON.parse(customQueryString));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
