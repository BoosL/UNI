import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class PreferencesService {

    protected perferences: { [name: string]: any };

    constructor() {
        const preferencesJson = localStorage.getItem('preferences');
        this.perferences = preferencesJson ? JSON.parse(preferencesJson) : {};
    }

    /**
     * 获得用户偏好设置
     * @param name 名称
     * @param defaultValue 默认值
     */
    public get(name: string, defaultValue = null) {
        return _.get(this.perferences, name, defaultValue);
    }

    /**
     * 设置用户偏好
     * @param name 名称
     * @param value 值
     */
    public set(name: string, value: any) {
        _.set(this.perferences, name, value);
        const preferencesJson = JSON.stringify(this.perferences);
        localStorage.setItem('preferences', preferencesJson);
        return value;
    }

}
