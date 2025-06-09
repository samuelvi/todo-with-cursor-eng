"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit3, Check, X, Plus } from "lucide-react"

interface Todo {
  id: number
  text: string
  completed: boolean
  isEditing: boolean
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editText, setEditText] = useState("")

  // Create a new todo
  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const todo: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        isEditing: false,
      }
      setTodos([...todos, todo])
      setNewTodo("")
    }
  }

  // Delete a todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  // Toggle completion status
  const toggleComplete = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  // Start editing a todo
  const startEdit = (id: number, currentText: string) => {
    setEditText(currentText)
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, isEditing: true } : { ...todo, isEditing: false })))
  }

  // Save edited todo
  const saveEdit = (id: number) => {
    if (editText.trim() !== "") {
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: editText.trim(), isEditing: false } : todo)))
      setEditText("")
    }
  }

  // Cancel editing
  const cancelEdit = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, isEditing: false } : todo)))
    setEditText("")
  }

  // Handle key press for adding todos
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo()
    }
  }

  // Handle key press for editing todos
  const handleEditKeyPress = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter") {
      saveEdit(id)
    } else if (e.key === "Escape") {
      cancelEdit(id)
    }
  }

  // Calculate stats
  const totalTodos = todos.length
  const completedTodos = todos.filter((todo) => todo.completed).length
  const pendingTodos = totalTodos - completedTodos

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo List App</h1>
            <p className="text-gray-600">Stay organized and get things done</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="What needs to be done?"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={addTodo} disabled={!newTodo.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {totalTodos > 0 && (
          <div className="flex gap-4 mb-6 justify-center">
            <Badge variant="secondary" className="px-3 py-1">
              Total: {totalTodos}
            </Badge>
            <Badge variant="default" className="px-3 py-1 bg-green-500 hover:bg-green-600">
              Completed: {completedTodos}
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Pending: {pendingTodos}
            </Badge>
          </div>
        )}

        {/* Todo List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {todos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-500">Add your first task above to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo, index) => (
                  <div key={todo.id}>
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <Checkbox
                        id={`todo-${todo.id}`}
                        checked={todo.completed}
                        onCheckedChange={() => toggleComplete(todo.id)}
                      />

                      <div className="flex-1">
                        {todo.isEditing ? (
                          <Input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => handleEditKeyPress(e, todo.id)}
                            className="h-8"
                            autoFocus
                          />
                        ) : (
                          <label
                            htmlFor={`todo-${todo.id}`}
                            className={`cursor-pointer ${
                              todo.completed ? "line-through text-muted-foreground" : "text-foreground"
                            }`}
                          >
                            {todo.text}
                          </label>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {todo.isEditing ? (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => saveEdit(todo.id)} className="h-8 w-8 p-0">
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => cancelEdit(todo.id)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEdit(todo.id, todo.text)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteTodo(todo.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    {index < todos.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Built with React and shadcn/ui</p>
            <p>Stay productive and organized! 🚀</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
