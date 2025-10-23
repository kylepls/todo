"use client"

import { useTodos } from "@/contexts/TodoContext"
import { Card, Title } from "@mantine/core"
import moment from "moment"
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface CompletionData {
  date: string;
  count: number;
}

interface CompletionChartProps {
  onBarClick?: (date: string) => void;
}

export function CompletionChart({ onBarClick }: CompletionChartProps) {
  const { todos } = useTodos()

  const completionData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = moment().subtract(6 - i, "day").format("YYYY-MM-DD")
      return { date, count: 0 }
    })

    if (todos) {
      todos.forEach(todo => {
        if (todo.status === "Completed" && todo.completed_at) {
          const completedDate = moment(todo.completed_at).format("YYYY-MM-DD")
          const dataPoint = last7Days.find(d => d.date === completedDate)
          if (dataPoint) {
            dataPoint.count++
          }
        }
      })
    }

    return last7Days
  }, [todos])

  const chartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = moment().subtract(6 - i, "day").format("YYYY-MM-DD")
      const dataPoint = completionData.find(d => d.date === date)
      return {
        date: moment(date).format("MMM D"),
        fullDate: date,
        count: dataPoint?.count || 0,
      }
    })
  }, [completionData])

  const maxCount = useMemo(() => {
    return Math.max(...chartData.map(d => d.count), 1)
  }, [chartData])

  const handleBarClick = (data: any) => {
    if (onBarClick && data?.fullDate) {
      onBarClick(data.fullDate)
    }
  }

  return (
    <Card padding="lg" radius="md" withBorder>
      <Title order={3} mb="md" ta="center">Completion Chart (Last 7 Days)</Title>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a"/>
          <XAxis dataKey="date" stroke="#71717a"/>
          <YAxis stroke="#71717a" allowDecimals={false} domain={[0, maxCount]}/>
          <Tooltip
            contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a" }}
            labelStyle={{ color: "#fafafa" }}
          />
          <Bar dataKey="count" fill="#22c55e" isAnimationActive={false} onClick={handleBarClick} cursor="pointer"/>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

