import {
    Model, Document, SaveOptions, QueryFindOneAndRemoveOptions, QueryFindOneAndUpdateOptions
} from 'mongoose'
import { messages } from '@messages'
import { isObjectValid, getEnvironmentVariable } from '@utils/platform.util'

export const findOperations = {
    find: (model: Model<any>, query: any, projection: any = null, sort: any = {}): Promise<any> => new Promise<any>((resolve, reject): void => {
        if (!isObjectValid(query)) {
            reject(new Error(getEnvironmentVariable(messages.MON002.code)))
        } if (!isObjectValid(sort)) {
            reject(new Error(getEnvironmentVariable(messages.MON004.code)))
        } else {
            model.find(query, projection).sort(sort).then((result) => {
                if (result) {
                    resolve(result)
                } else {
                    resolve(getEnvironmentVariable(messages.COM001.code))
                }
            }).catch((error: Error) => reject(error))
        }
    }),
    findOne: (model: Model<any>, query: any, projection: any = null): Promise<any> => new Promise<any>((resolve, reject): void => {
        if (!isObjectValid(query)) {
            reject(new Error(getEnvironmentVariable(messages.MON002.code)))
        } else {
            model.findOne(query, projection).then((result) => {
                if (result) {
                    resolve(result)
                } else {
                    resolve(undefined)
                }
            }).catch((error: Error) => reject(error))
        }
    }),
    count: (model: Model<any>, query: any, projection: any = null): Promise<any> => new Promise<any>((resolve, reject): void => {
        if (!isObjectValid(query)) {
            reject(new Error(getEnvironmentVariable(messages.MON002.code)))
        } else {
            model.countDocuments(query).then((result) => {
                if (result) {
                    resolve(result)
                } else {
                    resolve(undefined)
                }
            }).catch((error: Error) => reject(error))
        }
    }),
    findById: (model: Model<any>, id: any | string | number, projection: any = null): Promise<any> => new Promise<any>((resolve, reject): void => {
        if (!id) {
            reject(new Error(getEnvironmentVariable(messages.MON001.code)))
        } else {
            model.findById(id, projection).then((result) => {
                if (result) {
                    resolve(result)
                } else {
                    resolve(getEnvironmentVariable(messages.COM001.code))
                }
            }).catch((error: Error) => reject(error))
        }
    }),
    findByIdAndDelete: (model: Model<any>, id: any | string | number, options: QueryFindOneAndRemoveOptions): Promise<any> => new Promise<any>((resolve, reject): void => {
        if (!id) {
            reject(new Error(getEnvironmentVariable(messages.MON001.code)))
        } else {
            model.findByIdAndDelete(id, options).then((result) => {
                if (result) {
                    resolve(result)
                } else {
                    resolve(getEnvironmentVariable(messages.COM001.code))
                }
            }).catch((error: Error) => reject(error))
        }
    }),
    findByIdAndRemove: (model: Model<any>, id: any | string | number, options: QueryFindOneAndRemoveOptions): Promise<any> => new Promise<any>((resolve, reject): void => {
        if (!id) {
            reject(new Error(getEnvironmentVariable(messages.MON001.code)))
        } else {
            model.findByIdAndRemove(id, options).then((result) => {
                if (result) {
                    resolve(result)
                } else {
                    resolve(getEnvironmentVariable(messages.COM001.code))
                }
            }).catch((error: Error) => reject(error))
        }
    }),
    findByIdAndUpdate: (model: Model<any>, id: any | string | number, update: any, options: QueryFindOneAndUpdateOptions = {}): Promise<any> => new Promise<any>((resolve, reject): void => {
        if (!id) {
            reject(new Error(getEnvironmentVariable(messages.MON001.code)))
        } else if (!isObjectValid(update)) {
            reject(new Error(getEnvironmentVariable(messages.MON003.code)))
        } else {
            model.findByIdAndUpdate(id, update, options).then((result) => {
                if (result) {
                    resolve(result)
                } else {
                    resolve(getEnvironmentVariable(messages.COM001.code))
                }
            }).catch((error: Error) => reject(error))
        }
    }),
    aggregate: (model: Model<any>, aggregations: any[]): Promise<any> => new Promise<any>((resolve, reject): void => {
        if (!isObjectValid(aggregations)) {
            reject(new Error(getEnvironmentVariable(messages.MON003.code)))
        } else {
            model.aggregate(aggregations).then((result) => {
                if (result) {
                    resolve(result)
                } else {
                    resolve(getEnvironmentVariable(messages.COM001.code))
                }
            }).catch((error: Error) => reject(error))
        }
    }),
}

export const createOperations = {
    save: (document: Document, saveOptions?: SaveOptions): Promise<any> => new Promise<any>((resolve, reject): void => {
        document.save(saveOptions || {}).then((result) => {
            if (result) {
                resolve(result)
            } else {
                resolve(getEnvironmentVariable(messages.COM001.code))
            }
        }).catch((error: Error) => reject(error))
    }),
    insertMany: (model: Model<any>, data: any): Promise<any> => new Promise<any>((resolve, reject): void => {
        model.insertMany(data).then((result) => {
            if (result) {
                resolve(result)
            } else {
                resolve(getEnvironmentVariable(messages.COM001.code))
            }
        }).catch((error: Error) => reject(error))
    }),
    updateOne: (model: Model<any>, query: any = {}, data: any): Promise<any> => new Promise<any>((resolve, reject): void => {
        model.findOneAndUpdate(query, data, { new: true }).then((result) => {
            if (result) {
                resolve(result)
            } else {
                resolve(getEnvironmentVariable(messages.COM001.code))
            }
        }).catch((error: Error) => reject(error))
    }),
    updateMany: (model: Model<any>, query: any = {}, data: any): Promise<any> => new Promise<any>((resolve, reject): void => {
        model.updateMany(query, data).then((result) => {
            if (result) {
                resolve(result)
            } else {
                resolve(getEnvironmentVariable(messages.COM001.code))
            }
        }).catch((error: Error) => reject(error))
    }),
    updateOneUpsert: (model: Model<any>, query: any = {}, data: any): Promise<any> => new Promise<any>((resolve, reject): void => {
        model.findOneAndUpdate(query, data, { new: true, upsert: true, setDefaultsOnInsert: true }).then((result) => {
            if (result) {
                resolve(result)
            } else {
                resolve(getEnvironmentVariable(messages.COM001.code))
            }
        }).catch((error: Error) => reject(error))
    })
}

export const deleteOperations = {
    deleteMany: (model: Model<any>, data: any): Promise<any> => new Promise<any>((resolve, reject): void => {
        if (!isObjectValid(data)) {
            reject(new Error(getEnvironmentVariable(messages.MON003.code)))
        } else {
            model.deleteMany(data).then((result) => {
                if (result) {
                    resolve(result)
                } else {
                    resolve(getEnvironmentVariable(messages.COM001.code))
                }
            }).catch((error: Error) => reject(error))
        }
    }),
    deleteOne: (model: Model<any>, data: any): Promise<any> => new Promise<any>((resolve, reject): void => {
        if (!isObjectValid(data)) {
            reject(new Error(getEnvironmentVariable(messages.MON003.code)))
        } else {
            model.deleteOne(data).then((result) => {
                if (result) {
                    resolve(result)
                } else {
                    resolve(getEnvironmentVariable(messages.COM001.code))
                }
            }).catch((error: Error) => reject(error))
        }
    })
}
