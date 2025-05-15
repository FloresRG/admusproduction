"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
  TableFooterCell,
} from "@/components/ui/Table/index"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, ChevronLeft, ChevronRight, Filter, RefreshCw } from "lucide-react"

// Define tus tipos
export type DataTableColumn = {
  id: string
  header: string
  accessorKey?: string
  cell?: (row: Record<string, any>) => React.ReactNode
  enableSorting?: boolean
}

export type DataTableProps = {
  
  columns: DataTableColumn[]
  data: Record<string, any>[]
  onRowSelect?: (selectedRows: Record<string, any>[]) => void
  itemsPerPage?: number
  title?: string
}

export function DataTable({ columns, data, onRowSelect, itemsPerPage = 5, title }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<Record<string, any>[]>([])
  const [filteredData, setFilteredData] = useState(data)
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending" | null
  }>({ key: "", direction: null })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setCurrentPage(1)
    if (!searchTerm) {
      setFilteredData(data)
      return
    }
    const lower = searchTerm.toLowerCase()
    setFilteredData(data.filter((item) => Object.values(item).some((val) => String(val).toLowerCase().includes(lower))))
  }, [searchTerm, data])

  // Ordenamiento
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" | null = "ascending"

    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending"
      } else if (sortConfig.direction === "descending") {
        direction = null
      }
    }

    setSortConfig({ key, direction })

    if (direction === null) {
      setFilteredData([...data])
      return
    }

    setFilteredData(
      [...filteredData].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === "ascending" ? -1 : 1
        }
        if (a[key] > b[key]) {
          return direction === "ascending" ? 1 : -1
        }
        return 0
      }),
    )
  }

  // Simulación de carga
  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }

  const start = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(start, start + itemsPerPage)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Selección de filas
  const handleRowSelect = (row: Record<string, any>) => {
    const exists = selectedRows.some((r) => r.id === row.id)
    const newSel = exists ? selectedRows.filter((r) => r.id !== row.id) : [...selectedRows, row]
    setSelectedRows(newSel)
    onRowSelect?.(newSel)
  }
  const handleSelectAll = () => {
    const allSelected = selectedRows.length === paginatedData.length
    const newSel = allSelected ? [] : [...paginatedData]
    setSelectedRows(newSel)
    onRowSelect?.(newSel)
  }

  return (
    <div className="w-full space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="flex items-center gap-1 text-red-700 border-red-200 hover:bg-red-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      )}

      {/* Barra de herramientas */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        {/* Buscador */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200 transition-all"
          />
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-1" />
            Filtrar
          </Button>
          {selectedRows.length > 0 && (
            <Button size="sm" className="bg-red-700 hover:bg-red-800 text-white">
              Acciones ({selectedRows.length})
            </Button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className={`transition-opacity duration-300 ${isLoading ? "opacity-60" : "opacity-100"}`}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                  onCheckedChange={handleSelectAll}
                  className="border-white"
                />
              </TableHead>
              {columns.map((col) => (
                <TableHead
                  key={col.id}
                  onClick={() => col.enableSorting && requestSort(col.accessorKey || col.id)}
                  className={col.enableSorting ? "cursor-pointer hover:bg-red-800 transition-colors" : ""}
                >
                  <div className="flex items-center">
                    {col.header}
                    {col.enableSorting && sortConfig.key === (col.accessorKey || col.id) && (
                      <span className="ml-1">
                        {sortConfig.direction === "ascending" ? "↑" : sortConfig.direction === "descending" ? "↓" : ""}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-gray-500">
                  No hay resultados disponibles.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, i) => {
                const isSel = selectedRows.some((r) => r.id === row.id)
                return (
                  <TableRow
                    key={row.id ?? i}
                    className={`
                      ${isSel ? "bg-red-50" : "hover:bg-gray-50"} 
                      cursor-pointer
                      ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    `}
                    onClick={() => handleRowSelect(row)}
                  >
                    <TableCell className="w-[50px]">
                      <Checkbox
                        checked={isSel}
                        onCheckedChange={() => handleRowSelect(row)}
                        className={isSel ? "border-red-500" : ""}
                      />
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell key={col.id}>{col.cell ? col.cell(row) : row[col.accessorKey!]}</TableCell>
                    ))}
                  </TableRow>
                )
              })
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableFooterCell colSpan={columns.length + 1}>
                <div className="flex items-center justify-between py-1">
                  <div className="text-sm text-gray-700">
                    Mostrando {filteredData.length > 0 ? start + 1 : 0} a{" "}
                    {Math.min(start + itemsPerPage, filteredData.length)} de {filteredData.length} registros
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0 border-gray-300"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <Button
                            key={i}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`h-8 w-8 p-0 ${
                              currentPage === pageNum ? "bg-red-700 hover:bg-red-800" : "border-gray-300"
                            }`}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0 border-gray-300"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </TableFooterCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
