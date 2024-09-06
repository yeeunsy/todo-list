import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  value: {
    // 해야 할 일 나타내는 곳
    type: String,
    required: true,
  },
  order: {
    // 할 일의 순서를 나타내는 곳
    type: Number,
    required: true,
  },
  doneAt: {
    // 완료된 날짜
    type: Date, // doneAt 필드는 Date 타입을 가집니다.
    required: false, // doneAt 필드는 필수 요소가 아닙니다.
  },
});

// 프론트엔드 서빙을 위한 코드입니다. 모르셔도 괜찮아요!
TodoSchema.virtual("todoId").get(function () {
  return this._id.toHexString();
});
TodoSchema.set("toJSON", {
  virtuals: true,
});

// TodoSchema를 바탕으로 Todo모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model("Todo", TodoSchema);
