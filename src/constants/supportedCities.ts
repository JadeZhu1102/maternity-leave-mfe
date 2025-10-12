/**
 * 支持的13个城市列表
 * 根据用户要求，仅支持以下13个城市的产假政策
 */

export interface City {
  /** 城市代码 */
  code: string;
  /** 城市名称 */
  name: string;
  /** 省份 */
  province: string;
}

/**
 * 支持的13个城市列表
 * 使用城市拼音作为code，与API接口一致
 */
export const SUPPORTED_CITIES: City[] = [
  { code: 'beijing', name: '北京', province: '北京' },
  { code: 'shanghai', name: '上海', province: '上海' },
  { code: 'guangzhou', name: '广州', province: '广东' },
  { code: 'shenzhen', name: '深圳', province: '广东' },
  { code: 'tianjin', name: '天津', province: '天津' },
  { code: 'nanjing', name: '南京', province: '江苏' },
  { code: 'hangzhou', name: '杭州', province: '浙江' },
  { code: 'jinan', name: '济南', province: '山东' },
  { code: 'qingdao', name: '青岛', province: '山东' },
  { code: 'wuhan', name: '武汉', province: '湖北' },
  { code: 'changsha', name: '长沙', province: '湖南' },
  { code: 'chongqing', name: '重庆', province: '重庆' },
  { code: 'chengdu', name: '成都', province: '四川' },
];

/**
 * 根据城市代码获取城市信息
 * @param cityCode 城市代码
 * @returns 城市信息或undefined
 */
export const getCityByCode = (cityCode: string): City | undefined => {
  return SUPPORTED_CITIES.find(city => city.code === cityCode);
};

/**
 * 根据城市名称获取城市信息
 * @param cityName 城市名称
 * @returns 城市信息或undefined
 */
export const getCityByName = (cityName: string): City | undefined => {
  return SUPPORTED_CITIES.find(city => city.name === cityName);
};
