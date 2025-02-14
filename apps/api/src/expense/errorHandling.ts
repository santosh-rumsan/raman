interface Error {
  line: string;
  message: string;
}

export class ErrorManager {
  private error: Error[] = [];
  private static instance: ErrorManager;

  private constructor() {
    this.error = [];
  }
  static getInstance() {
    if (!ErrorManager.instance) {
      ErrorManager.instance = new ErrorManager();
    }
    return ErrorManager.instance;
  }

  addError(line: string, message: string) {
    this.error.push({ line: line, message: message });
  }
  removeError() {
    this.error = [];
  }

  listError() {
    return this.error;
  }
}
