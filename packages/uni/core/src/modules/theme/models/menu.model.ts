import { MenuGroup } from './menu-group.model';

export interface Menu {
  id: string;
  label: string;
  icon?: string;
  modules?: string[];
  url?: string;
  params?: { [name: string]: string };
  apiUrl?: string;
  parentId?: string;
  parent?: Menu;
  isLocal?: boolean;
  children?: Menu[];
  group?: MenuGroup;
}

export const allMenus: Menu[] = [
  // MARKETING 客户管理
  {
    id: '1010', label: 'Leads管理（渠道）', icon: 'code:compiling', modules: ['marketing'],
    url: '/so-customers', apiUrl: 'v2/customer/source/customers',
    group: { label: 'MARKETING' }
  }, {
    id: '1020', label: '新增leads（渠道）', icon: 'home:commode-1', modules: ['marketing'],
    url: '/so-customers/_create', apiUrl: 'v2/customer/source/customers',
    group: { label: 'MARKETING' }
  }, {
    id: '1030', label: '批量导入客户（渠道）', icon: 'communication:outgoing-box', modules: ['marketing'],
    url: '/so-customers/_import', apiUrl: 'v2/customer/import_status',
    group: { label: 'MARKETING' }
  }, {
    id: '1031', label: '客户白名单（网销）', icon: 'communication:clipboard-list', modules: ['marketing'],
    url: '/so-customers/whitelist', apiUrl: 'v2/customer/network/whitelist',
    group: { label: 'MARKETING' }
  }, {
    id: '1040', label: '客户管理（前台）', icon: 'code:compiling', modules: ['marketing', 'administration'],
    url: '/us-customers', apiUrl: 'v2/customer/usher/customers',
    group: { label: 'MARKETING' }
  }, {
    id: '1050', label: '新增客户（前台）', icon: 'home:commode-1', modules: ['marketing'],
    url: '/us-customers/_create', apiUrl: 'v2/customer/usher/customers',
    group: { label: 'MARKETING' }
  }, {
    id: '1060', label: '客户管理（CC）', icon: 'code:compiling', modules: ['marketing'],
    group: { label: 'MARKETING' }
  }, {
    id: '106001', label: '客户列表', parentId: '1060', modules: ['marketing'],
    url: '/cc-customers', apiUrl: 'v2/customer/cc/customers',
  }, {
    id: '106002', label: 'Old Call', parentId: '1060', modules: ['marketing'],
    url: '/cc-partial-customers', params: { scope: 'old_call' }, apiUrl: 'v2/customer/cc/customers'
  }, {
    id: '106003', label: '已咨询', parentId: '1060', modules: ['marketing'],
    url: '/cc-partial-customers', params: { scope: 'consulted' }, apiUrl: 'v2/customer/cc/customers'
  }, /* , {
    id: '100604', label: '订金客户', parentId: '1006',
    url: '/cc-partial-customers', params: { scope: 'has_deposit' }, apiUrl: 'v2/customer/cc/customers'
  }, */

  // TMK 客户流转系统
  {
    id: '2010', label: '客户流转公共池', icon: 'shopping:box-2', modules: ['tmk'],
    url: '/communal-pool', apiUrl: 'v2/tmk/customers/public',
    group: { label: 'TMK' }
  }, {
    id: '2020', label: '客户管理（TMK）', icon: 'communication:active-call', modules: ['tmk'],
    url: '/customers', params: { tag: 'today_follows' }, apiUrl: 'v2/tmk/customers',
    group: { label: 'TMK' }
  }, {
    id: '2030', label: 'TMK员工管理', icon: 'general:user', modules: ['tmk'],
    url: '/employees', apiUrl: 'v2/tmk/configs',
    group: { label: 'TMK' }
  },

  /* {
    id: '2001', label: '学员列表', icon: 'student',
    group: { label: 'TEACHING' }
  }, {
    id: '200101', label: '全部学员', parentId: '2001',
    url: '/students', apiUrl: 'students'
  }, {
    id: '200102', label: '重要学员', modules: ['teaching'], parentId: '2001',
    url: '/students', params: { scope: 'importance' }, apiUrl: 'students'
  }, {
    id: '200103', label: '小班学员', modules: ['teaching'], parentId: '2001',
    url: '/vip_classes', apiUrl: 'students'
  }, {
    id: '200104', label: '留学学员', modules: ['teaching'], parentId: '2001',
    url: '/students', params: { scope: 'abroad' }, apiUrl: 'students'
  }, {
    id: '200105', label: '历史学员', modules: ['teaching'], parentId: '2001',
    url: '/students', params: { scope: 'history' }, apiUrl: 'students'
  }, {
    id: '200107', label: '学员投诉', modules: ['teaching'], parentId: '2001',
    url: '/complaints', apiUrl: 'student_complaints'
  }, */

  // TEACHING 教学系统
  {
    id: '3010', label: '教学管理', icon: 'code:compiling', modules: ['teaching'],
    group: { label: 'TEACHING' }
  }, {
    id: '301001', label: '排课管理', parentId: '3010', modules: ['teaching'],
    url: '/curriculum-schedules', apiUrl: 'curriculum_schedules'
  }, {
    id: '301002', label: '课前预习', parentId: '3010', modules: ['teaching'],
    url: '/before-classes', apiUrl: 'after_classes'
  }, {
    id: '301003', label: '课后作业', parentId: '3010', modules: ['teaching'],
    url: '/after-classes', apiUrl: 'after_classes'
  }, {
    id: '301004', label: '成绩管理', parentId: '3010', modules: ['teaching'],
    url: '/achievements', apiUrl: 'achievements'
  }, {
    id: '3020', label: '学员管理', icon: 'clothes:shirt', modules: ['teaching'],
    group: { label: 'TEACHING' }
  }, {
    id: '302001', label: '学员列表', parentId: '3020', modules: ['teaching'],
    url: '/students', apiUrl: 'students'
  }, {
    id: '302002', label: '重要学员', parentId: '3020', modules: ['teaching'],
    url: '/students', params: { scope: 'importance' }, apiUrl: 'students'
  }, {
    id: '302003', label: '小班学员', parentId: '3020', modules: ['teaching'],
    url: '/vip_classes', apiUrl: 'students'
  }, {
    id: '302004', label: '留学学员', parentId: '3020', modules: ['teaching'],
    url: '/students', params: { scope: 'abroad' }, apiUrl: 'students'
  }, {
    id: '302005', label: '历史学员', parentId: '3020', modules: ['teaching'],
    url: '/students', params: { scope: 'history' }, apiUrl: 'students'
  }, {
    id: '3030', label: '老师管理', icon: 'general:user', modules: ['teaching'],
    group: { label: 'TEACHING' }
  }, {
    id: '303001', label: '老师列表', parentId: '3030', modules: ['teaching'],
    url: '/teachers', apiUrl: 'campuses/{campus_id}/teachers'
  }, {
    id: '303002', label: 'Etp老师', parentId: '3030', modules: ['teaching'],
    url: '/teachers', params: { scope: 'etp' }, apiUrl: 'campuses/{campus_id}/teachers'
  }, {
    id: '303003', label: '老师时间管理', parentId: '3030', modules: ['teaching'],
    url: '/teacher-schedules', apiUrl: 'teacher_schedules'
  }, {
    id: '3040', label: '学员投诉', icon: 'code:warning-1-circle', modules: ['teaching'],
    url: '/complaints', apiUrl: 'student_complaints',
    group: { label: 'TEACHING' }
  }, {
    id: '3050', label: '教学日志', icon: 'communication:clipboard-list', modules: ['teaching'],
    group: { label: 'TEACHING' }
  }, {
    id: '305001', label: '智能排课日志', parentId: '3050', modules: ['teaching'],
    url: '/logs', params: { scope: 'auto_curriculum_schedule' }, apiUrl: 'campuses/{campus_id}/teaching_logs'
  }, {
    id: '305002', label: '手动排课日志', parentId: '3050', modules: ['teaching'],
    url: '/logs', params: { scope: 'manual_curriculum_schedule' }, apiUrl: 'campuses/{campus_id}/teaching_logs'
  }, {
    id: '305003', label: '学生订课日志', parentId: '3050', modules: ['teaching'],
    url: '/logs', params: { scope: 'student_curriculum_schedule' }, apiUrl: 'campuses/{campus_id}/teaching_logs'
  }, {
    id: '305004', label: '签课日志', parentId: '3050', modules: ['teaching'],
    url: '/logs', params: { scope: 'sign_curriculum_schedule' }, apiUrl: 'campuses/{campus_id}/teaching_logs'
  },

  {
    id: '9910', label: '基础课程管理', icon: 'layout:layout-left-panel-2', modules: ['settings'],
    url: '/curriculums', apiUrl: 'products',
    group: { label: 'SETTINGS' }
  }, {
    id: '9920', label: '校区管理', icon: 'home:building', modules: ['settings'],
    url: '/schools', apiUrl: 'campus',
    group: { label: 'SETTINGS' }
  }, {
    id: '9930', label: '银行分期管理', icon: 'shopping:wallet-3', modules: ['settings'],
    url: '/banks', apiUrl: 'banks',
    group: { label: 'SETTINGS' }
  }, {
    id: '9990', label: '帮助文档管理', icon: 'home:library', modules: ['settings'],
    url: '/documents', apiUrl: 'settings/documents',
    group: { label: 'SETTINGS' }
  }

];
