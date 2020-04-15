import { Injectable } from '@angular/core';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { SelectOption } from '../../../models/models';
import { BaseService } from '../../../services/base.service';
import { Product } from '../../models/curriculum-manager.model';
import { Enums } from '../../enums';

export abstract class BaseProductService<T extends Product> extends BaseService<T> {

  protected rules = {
    id: {
      label: '产品主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    name: {
      label: '产品名称', columnType: NgxExcelColumnType.Text
    },
    type: {
      label: '产品类型', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Product.Type)
    },
    level: {
      label: 'Etp级别', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Product.EtpLevel)
    },
    curriculumCount: {
      label: '课时数量', columnType: NgxExcelColumnType.Number
    },
    isPresented: {
      label: '是否赠品？', columnType: NgxExcelColumnType.Bool
    },
    isPackaged: {
      label: '是否整体售卖？', columnType: NgxExcelColumnType.Bool
    },
    description: {
      label: '产品描述', columnType: NgxExcelColumnType.MultilineText, optional: true
    }
  } as NgxExcelModelColumnRules<T>;

  /**
   * 获得所有的产品类型枚举
   */
  public getProductTypes(): SelectOption[] {
    return this.getSelectOptions(Enums.Product.Type);
  }

  /**
   * 获得所有的Etp用途枚举
   */
  public getEtpPurposes(): SelectOption[] {
    return this.getSelectOptions(Enums.Product.EtpPurpose);
  }

  /**
   * 获得所有的Etp期限枚举
   */
  public getEtpPeriods(): SelectOption[] {
    return this.getSelectOptions(Enums.Product.EtpPeriod);
  }

  /**
   * 获得所有的Etp产品级别
   */
  public getEtpLevels(): SelectOption[] {
    return this.getSelectOptions(Enums.Product.EtpLevel);
  }

  /**
   * 获得 VIP 类产品类型
   */
  public getVipProductTypes(): SelectOption[] {
    const selectOptionValues = ['1', '4'];
    return this.getProductTypes().filter((selectOption) => selectOptionValues.indexOf(selectOption.value) >= 0);
  }

  /**
   * 获得 VIP_CLASS 产品类型（支持小班排课的产品类型）
   */
  public getVipClassProductTypes(): SelectOption[] {
    const selectOptionValues = ['4'];
    return this.getProductTypes().filter((selectOption) => selectOptionValues.indexOf(selectOption.value) >= 0);
  }

  /**
   * 获得 ETP 类产品类型
   */
  public getEtpProductTypes(): SelectOption[] {
    const selectOptionValues = ['2', '3'];
    return this.getProductTypes().filter((selectOption) => selectOptionValues.indexOf(selectOption.value) >= 0);
  }

  /**
   * 获得 DEMO 产品类型（支持客户排课的产品类型）
   */
  public getDemoProductTypes(): SelectOption[] {
    const selectOptionValues = ['6'];
    return this.getProductTypes().filter((selectOption) => selectOptionValues.indexOf(selectOption.value) >= 0);
  }

  /**
   * 获得多人教学支持的产品类型
   */
  public getMultiStudentProductTypes(): SelectOption[] {
    const selectOptionValues = ['2', '5', '6', '7', '8', '10'];
    return this.getProductTypes().filter((selectOption) => selectOptionValues.indexOf(selectOption.value) >= 0);
  }

  /**
   * 获得一对一教学支持的产品类型
   */
  public getSingleStudentProductTypes(): SelectOption[] {
    const selectOptionValues = ['1', '3', '4', '9'];
    return this.getProductTypes().filter((selectOption) => selectOptionValues.indexOf(selectOption.value) >= 0);
  }

}

@Injectable()
export class ProductService extends BaseProductService<Product> {

  protected resourceUri = 'products';
  protected resourceName = 'products';

}
