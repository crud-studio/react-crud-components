export const findValues = (obj: any, key: string): any[] => {
  return findValuesHelper(obj, key, []);
};

function findValuesHelper(obj: any, key: string, list: any[]): any[] {
  if (!obj) return list;
  if (obj instanceof Array) {
    for (let i in obj) {
      list = list.concat(findValuesHelper(obj[i], key, []));
    }
    return list;
  }
  if (obj[key]) list.push(obj[key]);

  if (typeof obj == "object") {
    var children = Object.keys(obj);
    if (children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        list = list.concat(findValuesHelper(obj[children[i]], key, []));
      }
    }
  }
  return list;
}

export const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
  if (value === null || value === undefined) return false;
  const testDummy: TValue = value;
  return true;
};
