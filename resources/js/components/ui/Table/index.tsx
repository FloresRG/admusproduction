import * as React from "react"

/* Tabla principal */
export const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
      <table ref={ref} className={`min-w-full divide-y divide-gray-200 ${className}`} {...props} />
    </div>
  ),
)
Table.displayName = "Table"

/* Encabezado (<thead>) */
export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={`bg-red-700 text-white ${className}`} {...props} />,
)
TableHeader.displayName = "TableHeader"

/* Cuerpo (<tbody>) */
export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={`bg-white divide-y divide-gray-200 ${className}`} {...props} />
  ),
)
TableBody.displayName = "TableBody"

/* Fila (<tr>) */
export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={`transition-colors duration-150 ease-in-out ${className}`} {...props} />
  ),
)
TableRow.displayName = "TableRow"

/* Celda de encabezado (<th>) */
export const TableHead = React.forwardRef<
  HTMLTableHeaderCellElement,
  React.ThHTMLAttributes<HTMLTableHeaderCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-white ${className}`}
    {...props}
  />
))
TableHead.displayName = "TableHead"

/* Celda de datos (<td>) */
export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={`px-6 py-4 text-sm text-gray-900 ${className}`} {...props} />
  ),
)
TableCell.displayName = "TableCell"

/* Pie de tabla (<tfoot>) */
export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={`bg-gray-50 border-t border-gray-200 ${className}`} {...props} />
  ),
)
TableFooter.displayName = "TableFooter"

/* Celda de pie (<td> en <tfoot>) */
export const TableFooterCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={`px-6 py-3 text-sm font-medium text-gray-700 ${className}`} {...props} />
  ),
)
TableFooterCell.displayName = "TableFooterCell"
