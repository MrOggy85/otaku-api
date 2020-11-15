
type Table = 'sentences' | 'challenges' | 'tags';
type ErrorCode = 'FOREIGN KEY'
// export type DbError = Error & {
//   code: ErrorCode
//   table: Table
// }

const errorMap: Record<string, ErrorCode> = {
  'FOREIGN KEY constraint failed': 'FOREIGN KEY'
}

// function DbError(this: DbError, message: string, code: DbError['code'], table: DbError['table']) {
//   this.message = message;
//   this.code = code;
//   this.table = table

//   return this
// }

// DbError.prototype = Error.prototype

// DbError.constructor = () => {}

export function getErrorCode(err: Error) {
  return errorMap[err.message]
}

export class DbError extends Error {
  code: ErrorCode
  table: Table

  constructor(message: string, code: ErrorCode, table: Table) {
    super(message)
    this.code = code
    this.table = table;
  }
}
