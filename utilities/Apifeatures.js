class Apifeatures {
          constructor(query, queryString){
                    this.query = query;
                    this.queryString = queryString;
          }

          // searach 
          Search(){
                    const searchStr = this.queryString.name?{
                              name:{
                                        $regex:this.queryString.name,
                                        $options:'i'
                              },
                    }:{};

          this.query = this.query.find({...searchStr});
          return this;
          }
          FilterByCategory(){
                    const queryCopy = {...this.queryString};
                    //remove some fields for category
                    const removeFields = ["name","page","limit"];
                    removeFields.forEach(key => delete queryCopy[key]);
                    const query = queryCopy.category?.length?queryCopy:{}
                    this.query = this.query.find(query);
                    return this;
          }
          // pagination
          Pagination(){
                    const  currentPage = Number(this.queryString.page) || 1;
                    const   showPerPage = 15;
                    const  skipProduct = showPerPage *(currentPage - 1);
                    this.query =  this.query.limit(showPerPage).skip(skipProduct);
                    return this
          }
}


module.exports = Apifeatures;