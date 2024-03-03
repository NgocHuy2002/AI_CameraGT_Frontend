export function extractIds(listData) {
  return listData?.map(element => element._id);
}

export function extractKeys(listData, key) {
  return listData?.map(element => element[key]);
}

export function groupBy(list, key) {
  return list.reduce(function(grouped, element) {
    (grouped[element[key]] = grouped[element[key]] || []).push(element);
    return grouped;
  }, {});
}

export function convertObject(list, key) {
  return list.reduce(function(prevValue, currentValue) {
    prevValue[currentValue?.[key]] = currentValue;
    return prevValue;
  }, {});
}


export function sortThuTu(a, b) {
  return a.thuTu - b.thuTu;
}

export function buildTree(allData, parentKey) {
  let congTyTreeForAdmin = [];
  congTyTreeForAdmin = createDataTree(allData, '_id', parentKey);
  return congTyTreeForAdmin;
}

export function createDataTree(dataset, idProperty, parentKey, sortFunction = sortThuTu) {
  const hashTable = Object.create(null);
  dataset.forEach(aData => hashTable[aData[idProperty]] = { ...aData, children: [] });
  const dataTree = [];
  dataset.forEach(aData => {
    if (aData[parentKey] && hashTable[aData[parentKey]]) {
      if (hashTable[aData[idProperty]]?.thuTu) {
        hashTable[aData[idProperty]].index = [hashTable[aData[parentKey]]?.index, hashTable[aData[idProperty]]?.thuTu].join('.');
      }
      hashTable[aData[parentKey]].children.push(hashTable[aData[idProperty]]);
    } else {
      if (hashTable[aData[idProperty]]?.thuTu) {
        hashTable[aData[idProperty]].index = hashTable[aData[idProperty]]?.thuTu;
      }
      dataTree.push(hashTable[aData[idProperty]]);
    }
  });
  return sortTree(dataTree, sortFunction);
}

export function sortTree(tree, sortFunction = sortThuTu) {
  const orgTree = tree.sort(sortFunction);
  let stackNodes = [...tree];
  while (stackNodes.length > 0) {
    const last = stackNodes.pop();
    if (last.children && last.children.length > 0) {
      last.children = last.children.sort(sortFunction);
      stackNodes.push(...last.children);
    }
  }
  return orgTree;
}
