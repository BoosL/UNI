import { AuthService } from '@uni/common';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EmployeeService, Employee } from '../../../logic/logic';

export abstract class BaseViewFilterService<T> {

  public abstract name: string;
  public currentMenuItem$ = new BehaviorSubject<T>(null);
  public currentMenuItem: T = null;

  protected displayControlSubject = new BehaviorSubject<boolean>(true);

  constructor(
    protected authService: AuthService,
    protected employeeService: EmployeeService
  ) { }

  /**
   * 控制是否显示视图筛选
   */
  public getDisplayControlStream(): Observable<boolean> {
    return this.displayControlSubject.asObservable();
  }

  /**
   * 获得可用的选项列表
   */
  public getMenuItemsStream(): Observable<T[]> {
    return this.getAvailableMenuItems().pipe(
      tap((menuItems: T[]) => {
        const sessionCurrentId = this.getSessionCurrentId();
        const currentMenuItem = menuItems.find((menuItem) => this.getMenuItemKey(menuItem) === sessionCurrentId);
        this.change(currentMenuItem || this.getDefaultSelectedMenuItem() || (menuItems.length > 0 ? menuItems[0] : null));
      })
    );
  }

  /**
   * 改变当前选择项
   * @param menuItem 选择项
   */
  public change(menuItem: T) {
    this.currentMenuItem = menuItem;
    if (menuItem) {
      this.setSessionCurrentId(this.getMenuItemKey(menuItem));
    } else {
      this.clear();
    }
    this.emit();
  }

  /**
   * 清除当前会话的选择项
   */
  public clear() {
    return sessionStorage.removeItem(this.name);
  }

  /**
   * 显示视图筛选下拉菜单
   */
  public show() {
    this.displayControlSubject.next(true);
  }

  /**
   * 隐藏视图筛选下拉菜单
   */
  public hide() {
    this.displayControlSubject.next(false);
  }

  /**
   * 通知其他组件当前视图的选项发生变化
   */
  protected emit() {
    this.currentMenuItem$.next(this.currentMenuItem);
  }

  /**
   * 获得当前登陆员工
   */
  protected getCurrentEmployee(): Employee {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? this.employeeService.createModel(null, currentUser) : null;
  }

  /**
   * 获得选择项的键
   * @param menuItem 选择项
   */
  protected getMenuItemKey(menuItem: T) {
    // tslint:disable-next-line: no-string-literal
    return menuItem['id'];
  }

  /**
   * 缓存当前会话选择的项
   * @param id 项主键
   */
  protected setSessionCurrentId(id: string) {
    sessionStorage.setItem(this.name, id);
  }

  /**
   * 获得当前会话选择的项主键
   */
  protected getSessionCurrentId(): string {
    return sessionStorage.getItem(this.name) || '';
  }

  /**
   * 获得可用的选择项
   */
  protected abstract getAvailableMenuItems(): Observable<T[]>;

  /**
   * 获得当前用户的缺省选择项
   */
  protected abstract getDefaultSelectedMenuItem(): T;

}
