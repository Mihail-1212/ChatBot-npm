const ObjectHelper = {
  ObjectKeysIncludedInSecondObjectKeys(object1, object2) {
    var array1 = Object.keys(object1),
      array2 = Object.keys(object2);
    return this.ArrayIncludeInSecondArray(array1, array2);
  }
,
  ArrayIncludeInSecondArray(array1, array2) {
    return array1.every(e => array2.includes(e))
  }
};

module.exports = ObjectHelper;