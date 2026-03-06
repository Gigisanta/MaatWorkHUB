import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteTodo, getTodos, addTodo, toggleTodo } from '../todo-actions';
import { db, studio_todos } from '@maatwork/database';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

// Mock dependencies
vi.mock('@maatwork/database', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  studio_todos: {
    id: 'studio_todos.id',
    createdAt: 'studio_todos.createdAt',
  },
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((col, val) => ({ col, val, type: 'eq' })),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid-1234'),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('todo-actions', () => {
  describe('getTodos', () => {
    it('should select todos from the database and order by createdAt', async () => {
      // Setup the mock chain for db.select().from().orderBy()
      const mockOrderBy = vi.fn().mockResolvedValue([{ id: 'todo-1', text: 'Test todo' }]);
      const mockFrom = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      (db.select as any).mockReturnValue({ from: mockFrom });

      const result = await getTodos();

      // Verify db.select was called
      expect(db.select).toHaveBeenCalled();

      // Verify from was called with the correct table
      expect(mockFrom).toHaveBeenCalledWith(studio_todos);

      // Verify orderBy was called with the correct column
      expect(mockOrderBy).toHaveBeenCalledWith(studio_todos.createdAt);

      // Verify the result
      expect(result).toEqual([{ id: 'todo-1', text: 'Test todo' }]);
    });
  });

  describe('addTodo', () => {
    it('should insert a new todo with default priority and revalidate the path', async () => {
      // Setup the mock chain for db.insert().values()
      const mockValues = vi.fn();
      (db.insert as any).mockReturnValue({ values: mockValues });

      await addTodo('New Todo Text');

      // Verify db.insert was called with the correct table
      expect(db.insert).toHaveBeenCalledWith(studio_todos);

      // Verify values was called with the correct data
      expect(mockValues).toHaveBeenCalledWith({
        id: 'test-uuid-1234',
        text: 'New Todo Text',
        priority: 'medium', // Default priority
        completed: false,
      });

      // Verify revalidatePath was called
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    it('should insert a new todo with explicit priority', async () => {
      // Setup the mock chain for db.insert().values()
      const mockValues = vi.fn();
      (db.insert as any).mockReturnValue({ values: mockValues });

      await addTodo('High Priority Todo', 'high');

      // Verify values was called with the correct explicit priority
      expect(mockValues).toHaveBeenCalledWith(
        expect.objectContaining({
          priority: 'high',
        })
      );
    });
  });

  describe('toggleTodo', () => {
    it('should update the completed status of a todo and revalidate the path', async () => {
      // Setup the mock chain for db.update().set().where()
      const mockWhere = vi.fn();
      const mockSet = vi.fn().mockReturnValue({ where: mockWhere });
      (db.update as any).mockReturnValue({ set: mockSet });

      const testId = 'todo-456';

      await toggleTodo(testId, true);

      // Verify db.update was called with the correct table
      expect(db.update).toHaveBeenCalledWith(studio_todos);

      // Verify set was called with the correct value
      expect(mockSet).toHaveBeenCalledWith({ completed: true });

      // Verify where was called with the eq function result
      expect(eq).toHaveBeenCalledWith(studio_todos.id, testId);
      expect(mockWhere).toHaveBeenCalledWith({
        col: studio_todos.id,
        val: testId,
        type: 'eq'
      });

      // Verify revalidatePath was called
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo and revalidate the path', async () => {
      // Setup the mock chain for db.delete().where()
      const mockWhere = vi.fn();
      (db.delete as any).mockReturnValue({ where: mockWhere });

      const testId = 'todo-123';

      await deleteTodo(testId);

      // Verify db.delete was called with the correct table
      expect(db.delete).toHaveBeenCalledWith(studio_todos);

      // Verify where was called with the eq function result
      expect(eq).toHaveBeenCalledWith(studio_todos.id, testId);
      expect(mockWhere).toHaveBeenCalledWith({
        col: studio_todos.id,
        val: testId,
        type: 'eq'
      });

      // Verify revalidatePath was called
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });
  });
});
