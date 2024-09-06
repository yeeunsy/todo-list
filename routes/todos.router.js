import express from "express";
import Todo from "../schemas/todo.schema.js";
import Joi from "joi";

const router = express.Router();

// 할 일 생성 API의 요청 데이터 검증을 위한 Joi 스키마를 정의합니다.
const createTodoSchema = Joi.object({
  value: Joi.string().min(1).max(50).required(),
});

// 할 일 등록 API
router.post("/todos", async (req, res, next) => {
  try {
    // // 1. 클라이언트로 받아온 데이터 가져오기
    // const { value } = req.body;

    //
    const validation = await createTodoSchema.validateAsync(req.body);

    const { value } = validation;

    // value 데이터를 전달하지 않았을 때 클라이언트 에러 반환
    if (!value) {
      return res.status(400).json({ errorMessage: "메모가 존재하지 않아요." });
    }

    // 2. 마지막 order데이터 조회
    // 하나의 데이터 조회
    // sort = 정렬
    const maxOrder = await Todo.findOne().sort("-order").exec();

    // 3. 존재하는 메모가 없다면 1로 설정, 있다면 +1로 설정
    const order = maxOrder ? maxOrder.order + 1 : 1;

    // 4. 해야할 일 등록
    const todo = new Todo({ value, order });
    await todo.save();

    // 5. 반환
    return res.status(201).json({ todo: todo });
  } catch (error) {
    next(error);
  }
});

// 해야할 일 목록 조회 API
router.get("/todos", async (req, res, next) => {
  // 1. 메모 목록 조회
  const todos = await Todo.find().sort("-order").exec();

  // 2. 목록 조회 결과 반환
  return res.status(200).json({ todos });
});

// 메모 순서 변경, 완료, 해제, 해야할 일 변경 API
router.patch("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const { order, done, value } = req.body;

  // 변경하려는 order
  const curTodo = await Todo.findById(todoId).exec();

  if (!curTodo) {
    return res.status(404).json({ errorMessage: "존재하지 않는 메모 입니다." });
  }

  // 메모 내용 변경
  if (value) {
    curTodo.value = value;
  }

  // 순서 변경
  if (order) {
    const targetTodo = await Todo.findOne({ order: order }).exec();

    if (targetTodo) {
      targetTodo.order = curTodo.order;
      await targetTodo.save();
    }

    curTodo.order = order;
  }

  // 메모 삭제
  if (done !== undefined) {
    curTodo.doneAt = done ? new Date() : null;
  }

  await curTodo.save();

  return res.status(200).json({});
});

// 메모 삭제 API
router.delete("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;

  const todo = await Todo.findById(todoId).exec();

  if (!todo) {
    return res.status(404).json({ errorMessage: "존재하지 않는 메모 입니다." });
  }

  await Todo.deleteOne({ _id: todoId });

  return res.status(200).json({});
});

export default router;
