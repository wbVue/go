

let requestPath = 'http://10.63.68.95:80/';

export const api = {
    queryEntityInPage: requestPath +  'entity/queryEntityInPage',  //获取实体列表
    deleteEntity: requestPath +  'entity/deleteEntity',   //删除实体
    queryEntityById: requestPath +  'entity/queryEntityById',   //获取实体列表
    saveEntity: requestPath +  'entity/saveEntity',   //保存实体
    queryAll: requestPath +  'entity/queryAll',   //获取所以的实体 /entity/queryAll
    //场景列表
    querySceneInPage: requestPath +  'scene/querySceneInPage',   //保存实体
    //创建场景
    saveScene: requestPath +  'scene/saveScene',   //创建场景 deleteScene
    //删除场景
    deleteScene: requestPath +  'scene/deleteScene',   //创建场景
    querySceneById: requestPath +  'scene/querySceneById',   //获取场景
    graphSave: requestPath +  'graph/save',   //保存场景 /graph/save
    queryFactorInPage: requestPath +  'factor/queryFactorInPage',   //因子列表
    deleteFactor: requestPath +  'factor/deleteFactor',   //删除因子
    saveFactor: requestPath +  'factor/saveFactor',   ///保存因子
    queryFactorById: requestPath +  'factor/queryFactorById',   ///获取因子
    factorQueryAll: requestPath +  'factor/queryAll',   ///获取所有因子 /factor/queryAll
    sendMessage: requestPath +  'dialog/sendMessage',   ///聊天接口 /dialog/sendMessage
}