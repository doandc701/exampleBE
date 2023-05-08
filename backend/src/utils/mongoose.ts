// lí do lỗi bảo mật nên sẽ phải chuyển json thành object literal

const multipleMongooseToObject = (mongoose: any) => {
  return mongoose.map((mongoose: any) => mongoose.toObject());
};
const mongooseToObject = (mongoose: any) => {
  return mongoose ? mongoose.toObject() : mongoose;
};
export { multipleMongooseToObject, mongooseToObject };
