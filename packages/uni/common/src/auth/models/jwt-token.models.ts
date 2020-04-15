export interface JwtToken {
  /**
   * 签发机构
   */
  iss: string;
  /**
   * 签发时间
   */
  iat: number;
  /**
   * 过期时间
   */
  exp: number;
  nbf: number;
  jti: string;
  /**
   * 员工ID
   */
  sub: string;
  prv: string;
  /**
   * Employee
   */
  role: string;
  /**
   * 随心学员工ID
   */
  eleId?: string;

  [index: string]: any;
}
