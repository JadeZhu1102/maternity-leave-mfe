/**
 * 城市数据
 * 包含中国主要城市及其行政区划代码
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
 * 中国主要城市列表
 * 包含直辖市、省会城市及计划单列市
 */
export const CITIES: City[] = [
  // 直辖市
  { code: '110000', name: '北京', province: '北京' },
  { code: '310000', name: '上海', province: '上海' },
  { code: '120000', name: '天津', province: '天津' },
  { code: '500000', name: '重庆', province: '重庆' },
  
  // 华北地区
  { code: '130100', name: '石家庄', province: '河北' },
  { code: '140100', name: '太原', province: '山西' },
  { code: '150100', name: '呼和浩特', province: '内蒙古' },
  
  // 东北地区
  { code: '210100', name: '沈阳', province: '辽宁' },
  { code: '220100', name: '长春', province: '吉林' },
  { code: '230100', name: '哈尔滨', province: '黑龙江' },
  
  // 华东地区
  { code: '320100', name: '南京', province: '江苏' },
  { code: '330100', name: '杭州', province: '浙江' },
  { code: '340100', name: '合肥', province: '安徽' },
  { code: '350100', name: '福州', province: '福建' },
  { code: '360100', name: '南昌', province: '江西' },
  { code: '370100', name: '济南', province: '山东' },
  
  // 中南地区
  { code: '410100', name: '郑州', province: '河南' },
  { code: '420100', name: '武汉', province: '湖北' },
  { code: '430100', name: '长沙', province: '湖南' },
  { code: '440100', name: '广州', province: '广东' },
  { code: '440300', name: '深圳', province: '广东' },
  { code: '450100', name: '南宁', province: '广西' },
  { code: '460100', name: '海口', province: '海南' },
  
  // 西南地区
  { code: '510100', name: '成都', province: '四川' },
  { code: '520100', name: '贵阳', province: '贵州' },
  { code: '530100', name: '昆明', province: '云南' },
  { code: '540100', name: '拉萨', province: '西藏' },
  
  // 西北地区
  { code: '610100', name: '西安', province: '陕西' },
  { code: '620100', name: '兰州', province: '甘肃' },
  { code: '630100', name: '西宁', province: '青海' },
  { code: '640100', name: '银川', province: '宁夏' },
  { code: '650100', name: '乌鲁木齐', province: '新疆' },
  
  // 特别行政区
  { code: '810000', name: '香港', province: '香港' },
  { code: '820000', name: '澳门', province: '澳门' },
  
  // 计划单列市
  { code: '210200', name: '大连', province: '辽宁' },
  { code: '330200', name: '宁波', province: '浙江' },
  { code: '350200', name: '厦门', province: '福建' },
  { code: '370200', name: '青岛', province: '山东' },
  { code: '440200', name: '珠海', province: '广东' },
  { code: '440400', name: '汕头', province: '广东' },
  { code: '440900', name: '湛江', province: '广东' },
  { code: '441300', name: '惠州', province: '广东' },
  { code: '460200', name: '三亚', province: '海南' },
  { code: '510500', name: '泸州', province: '四川' },
  { code: '511300', name: '南充', province: '四川' },
  { code: '530600', name: '昭通', province: '云南' },
  { code: '532300', name: '楚雄', province: '云南' },
  { code: '620400', name: '白银', province: '甘肃' },
  { code: '640300', name: '吴忠', province: '宁夏' },
  { code: '650200', name: '克拉玛依', province: '新疆' },
];
