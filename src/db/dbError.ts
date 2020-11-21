
const errorMap: Record<string, ErrorCode | undefined> = {
  'FOREIGN KEY constraint failed': 'FOREIGN_KEY'
}

export function getErrorCode(err: Error) {
  return errorMap[err.message] || 'Unknown'
}

type ErrorCode = 'Unknown' | 'FOREIGN_KEY'
type Table = 'sentences' | 'challenges' | 'tags';

export class DbError extends Error {
  code: ErrorCode
  table: Table

  constructor(message: string, code: ErrorCode, table: Table) {
    super(message)

    this.code = code
    this.table = table
  }
}
