import { v4 } from 'uuid';

class StringUtil {
  public id() {
    return v4();
  }
}

export const stringUtil = new StringUtil();
