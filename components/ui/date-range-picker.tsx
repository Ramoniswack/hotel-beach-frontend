"use client"

import * as React from "react"
import { format, addMonths } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"

interface DateRangePickerProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  onClose?: () => void
}

export function DateRangePicker({ date, onDateChange, onClose }: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date())

  const handleClear = () => {
    onDateChange?.(undefined)
  }

  const handleToday = () => {
    setCurrentMonth(new Date())
  }

  const handlePrevMonth = () => {
    setCurrentMonth(prev => addMonths(prev, -1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1))
  }

  return (
    <div className="bg-white border border-gray-200 shadow-lg w-full">
      {/* Custom Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={handlePrevMonth}
          className="text-gray-400 hover:text-gray-600 text-sm font-normal transition-colors"
        >
          &lt;Prev
        </button>
        <button
          onClick={handleToday}
          className="text-gray-500 hover:text-gray-700 text-base font-normal transition-colors"
        >
          Today
        </button>
        <button
          onClick={handleNextMonth}
          className="text-gray-400 hover:text-gray-600 text-sm font-normal transition-colors"
        >
          Next&gt;
        </button>
      </div>

      {/* Two Month Calendars */}
      <div className="flex divide-x divide-gray-200">
        <div className="flex-1">
          <Calendar
            mode="range"
            selected={date}
            onSelect={onDateChange}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            numberOfMonths={1}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            classNames={{
              months: "flex",
              month: "space-y-2 p-4 w-full",
              caption: "flex justify-start pt-1 relative items-center mb-2",
              caption_label: "text-base font-normal text-gray-500",
              caption_dropdowns: "flex gap-2",
              nav: "hidden",
              head_row: "flex justify-between mb-1",
              head_cell: "text-gray-500 font-normal text-xs w-8 text-center",
              row: "flex justify-between w-full mt-0.5",
              cell: "h-8 w-8 text-center text-sm p-0 relative",
              day: cn(
                "h-8 w-8 p-0 font-normal text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-none transition-colors"
              ),
              day_selected: "bg-gray-900 text-white font-bold hover:bg-gray-900 hover:text-white",
              day_today: "text-gray-900 font-bold",
              day_outside: "text-gray-300 opacity-50",
              day_disabled: "text-gray-200 opacity-50 cursor-not-allowed",
              day_range_middle: "bg-gray-900 text-white rounded-none",
              day_range_start: "bg-gray-900 text-white rounded-none font-bold",
              day_range_end: "bg-gray-900 text-white rounded-none font-bold",
            }}
          />
        </div>
        <div className="flex-1">
          <Calendar
            mode="range"
            selected={date}
            onSelect={onDateChange}
            month={addMonths(currentMonth, 1)}
            numberOfMonths={1}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            classNames={{
              months: "flex",
              month: "space-y-2 p-4 w-full",
              caption: "flex justify-start pt-1 relative items-center mb-2",
              caption_label: "text-base font-normal text-gray-500",
              nav: "hidden",
              head_row: "flex justify-between mb-1",
              head_cell: "text-gray-500 font-normal text-xs w-8 text-center",
              row: "flex justify-between w-full mt-0.5",
              cell: "h-8 w-8 text-center text-sm p-0 relative",
              day: cn(
                "h-8 w-8 p-0 font-normal text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-none transition-colors"
              ),
              day_selected: "bg-gray-900 text-white font-bold hover:bg-gray-900 hover:text-white",
              day_today: "text-gray-900 font-bold",
              day_outside: "text-gray-300 opacity-50",
              day_disabled: "text-gray-200 opacity-50 cursor-not-allowed",
              day_range_middle: "bg-gray-900 text-white rounded-none",
              day_range_start: "bg-gray-900 text-white rounded-none font-bold",
              day_range_end: "bg-gray-900 text-white rounded-none font-bold",
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <button
          onClick={handleClear}
          className="text-gray-400 hover:text-gray-600 text-sm font-normal transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm font-normal transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
