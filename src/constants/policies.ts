/**
 * 产假政策常量定义
 * Maternity leave policy constants
 */

import type { MaternityPolicy, PaternityPolicy } from '../types/policy';
import type { RegionCode } from '../types/calculator';

/** 全国主要城市产假政策数据 */
export const MATERNITY_POLICIES: Record<RegionCode, MaternityPolicy> = {
  beijing: {
    id: 'beijing-2023',
    name: '北京市产假政策',
    region: 'beijing',
    baseDays: 128, // 98天国家规定 + 30天北京市延长
    extraDaysRules: [
      {
        type: 'multiple_birth',
        days: 15,
        condition: { exact: true },
        description: '生育多胞胎的，每多生育1个婴儿，增加产假15天'
      },
      {
        type: 'difficult_birth',
        days: 15,
        condition: { exact: true },
        description: '难产的，增加产假15天'
      },
      {
        type: 'late_marriage',
        days: 30,
        condition: { min: 23 }, // 女性23岁以上算晚婚
        description: '晚育的，增加产假30天'
      }
    ],
    allowancePolicy: {
      type: 'social_insurance',
      calculationMethod: 'average_salary',
      percentage: 1.0,
      minAmount: 5360, // 北京市最低工资标准
      description: '按照本人上年度月平均缴费工资计发，不足最低工资标准的按最低工资标准计发'
    },
    effectiveDate: new Date('2023-01-01'),
    description: '根据《北京市人口与计划生育条例》等相关法规制定',
    regulationUrl: 'http://www.beijing.gov.cn/zhengce/zhengcefagui/202111/t20211126_2553932.html'
  },

  shanghai: {
    id: 'shanghai-2023',
    name: '上海市产假政策',
    region: 'shanghai',
    baseDays: 158, // 98天国家规定 + 60天上海市延长
    extraDaysRules: [
      {
        type: 'multiple_birth',
        days: 15,
        condition: { exact: true },
        description: '生育多胞胎的，每多生育1个婴儿，增加产假15天'
      },
      {
        type: 'difficult_birth',
        days: 15,
        condition: { exact: true },
        description: '难产的，增加产假15天'
      }
    ],
    allowancePolicy: {
      type: 'social_insurance',
      calculationMethod: 'average_salary',
      percentage: 1.0,
      minAmount: 2590, // 上海市最低工资标准
      description: '按照本人生育当月的缴费基数计发生育生活津贴'
    },
    effectiveDate: new Date('2023-01-01'),
    description: '根据《上海市人口与计划生育条例》等相关法规制定',
    regulationUrl: 'https://www.shanghai.gov.cn/nw12344/20200813/0001-12344_61707.html'
  },

  guangzhou: {
    id: 'guangzhou-2023',
    name: '广州市产假政策',
    region: 'guangzhou',
    baseDays: 178, // 98天国家规定 + 80天广东省延长
    extraDaysRules: [
      {
        type: 'multiple_birth',
        days: 15,
        condition: { exact: true },
        description: '生育多胞胎的，每多生育1个婴儿，增加产假15天'
      },
      {
        type: 'difficult_birth',
        days: 30,
        condition: { exact: true },
        description: '难产的，增加产假30天'
      }
    ],
    allowancePolicy: {
      type: 'social_insurance',
      calculationMethod: 'average_salary',
      percentage: 1.0,
      minAmount: 2300, // 广州市最低工资标准
      description: '按照用人单位上年度职工月平均工资计发'
    },
    effectiveDate: new Date('2023-01-01'),
    description: '根据《广东省人口与计划生育条例》等相关法规制定'
  },

  shenzhen: {
    id: 'shenzhen-2023',
    name: '深圳市产假政策',
    region: 'shenzhen',
    baseDays: 178, // 98天国家规定 + 80天广东省延长
    extraDaysRules: [
      {
        type: 'multiple_birth',
        days: 15,
        condition: { exact: true },
        description: '生育多胞胎的，每多生育1个婴儿，增加产假15天'
      },
      {
        type: 'difficult_birth',
        days: 30,
        condition: { exact: true },
        description: '难产的，增加产假30天'
      }
    ],
    allowancePolicy: {
      type: 'social_insurance',
      calculationMethod: 'average_salary',
      percentage: 1.0,
      minAmount: 2360, // 深圳市最低工资标准
      description: '按照用人单位上年度职工月平均工资计发'
    },
    effectiveDate: new Date('2023-01-01'),
    description: '根据《广东省人口与计划生育条例》等相关法规制定'
  },

  hangzhou: {
    id: 'hangzhou-2023',
    name: '杭州市产假政策',
    region: 'hangzhou',
    baseDays: 158, // 98天国家规定 + 60天浙江省延长
    extraDaysRules: [
      {
        type: 'multiple_birth',
        days: 15,
        condition: { exact: true },
        description: '生育多胞胎的，每多生育1个婴儿，增加产假15天'
      },
      {
        type: 'difficult_birth',
        days: 15,
        condition: { exact: true },
        description: '难产的，增加产假15天'
      }
    ],
    allowancePolicy: {
      type: 'social_insurance',
      calculationMethod: 'average_salary',
      percentage: 1.0,
      minAmount: 2280, // 杭州市最低工资标准
      description: '按照用人单位上年度职工月平均工资计发'
    },
    effectiveDate: new Date('2023-01-01'),
    description: '根据《浙江省人口与计划生育条例》等相关法规制定'
  },

  nanjing: {
    id: 'nanjing-2023',
    name: '南京市产假政策',
    region: 'nanjing',
    baseDays: 158, // 98天国家规定 + 60天江苏省延长
    extraDaysRules: [
      {
        type: 'multiple_birth',
        days: 15,
        condition: { exact: true },
        description: '生育多胞胎的，每多生育1个婴儿，增加产假15天'
      },
      {
        type: 'difficult_birth',
        days: 15,
        condition: { exact: true },
        description: '难产的，增加产假15天'
      }
    ],
    allowancePolicy: {
      type: 'social_insurance',
      calculationMethod: 'average_salary',
      percentage: 1.0,
      minAmount: 2280, // 南京市最低工资标准
      description: '按照用人单位上年度职工月平均工资计发'
    },
    effectiveDate: new Date('2023-01-01'),
    description: '根据《江苏省人口与计划生育条例》等相关法规制定'
  },

  other: {
    id: 'national-2023',
    name: '国家基础产假政策',
    region: 'other',
    baseDays: 98, // 国家规定基础产假
    extraDaysRules: [
      {
        type: 'multiple_birth',
        days: 15,
        condition: { exact: true },
        description: '生育多胞胎的，每多生育1个婴儿，增加产假15天'
      },
      {
        type: 'difficult_birth',
        days: 15,
        condition: { exact: true },
        description: '难产的，增加产假15天'
      }
    ],
    allowancePolicy: {
      type: 'social_insurance',
      calculationMethod: 'average_salary',
      percentage: 1.0,
      minAmount: 1690, // 全国最低工资标准参考
      description: '按照国家相关规定执行，具体标准请咨询当地社保部门'
    },
    effectiveDate: new Date('2023-01-01'),
    description: '根据《女职工劳动保护特别规定》等国家法规制定'
  }
};

/** 陪产假政策数据 */
export const PATERNITY_POLICIES: Record<RegionCode, PaternityPolicy> = {
  beijing: {
    id: 'beijing-paternity-2023',
    name: '北京市陪产假政策',
    region: 'beijing',
    days: 15,
    allowancePolicy: {
      type: 'social_insurance',
      calculationMethod: 'average_salary',
      percentage: 1.0,
      minAmount: 5360,
      description: '陪产假期间享受生育津贴'
    },
    conditions: ['配偶符合计划生育政策', '在本市参加生育保险'],
    description: '男方享受陪产假15天'
  },

  shanghai: {
    id: 'shanghai-paternity-2023',
    name: '上海市陪产假政策',
    region: 'shanghai',
    days: 10,
    allowancePolicy: {
      type: 'social_insurance',
      calculationMethod: 'average_salary',
      percentage: 1.0,
      minAmount: 2590,
      description: '陪产假期间享受生育津贴'
    },
    conditions: ['配偶符合计划生育政策', '在本市参加生育保险'],
    description: '男方享受陪产假10天'
  },

  guangzhou: {
    id: 'guangzhou-paternity-2023',
    name: '广州市陪产假政策',
    region: 'guangzhou',
    days: 15,
    conditions: ['配偶符合计划生育政策'],
    description: '男方享受陪产假15天'
  },

  shenzhen: {
    id: 'shenzhen-paternity-2023',
    name: '深圳市陪产假政策',
    region: 'shenzhen',
    days: 15,
    conditions: ['配偶符合计划生育政策'],
    description: '男方享受陪产假15天'
  },

  hangzhou: {
    id: 'hangzhou-paternity-2023',
    name: '杭州市陪产假政策',
    region: 'hangzhou',
    days: 15,
    conditions: ['配偶符合计划生育政策'],
    description: '男方享受陪产假15天'
  },

  nanjing: {
    id: 'nanjing-paternity-2023',
    name: '南京市陪产假政策',
    region: 'nanjing',
    days: 15,
    conditions: ['配偶符合计划生育政策'],
    description: '男方享受陪产假15天'
  },

  other: {
    id: 'national-paternity-2023',
    name: '国家陪产假政策',
    region: 'other',
    days: 7, // 各地标准不一，以7天为基准
    conditions: ['配偶符合计划生育政策'],
    description: '具体天数请咨询当地相关部门'
  }
};

/** 地区选项列表 */
export const REGION_OPTIONS = [
  { label: '北京市', value: 'beijing' as RegionCode },
  { label: '上海市', value: 'shanghai' as RegionCode },
  { label: '广州市', value: 'guangzhou' as RegionCode },
  { label: '深圳市', value: 'shenzhen' as RegionCode },
  { label: '杭州市', value: 'hangzhou' as RegionCode },
  { label: '南京市', value: 'nanjing' as RegionCode },
  { label: '其他地区', value: 'other' as RegionCode }
];

/** 就业类型选项列表 */
export const EMPLOYMENT_TYPE_OPTIONS = [
  { label: '全职员工', value: 'full-time' },
  { label: '兼职员工', value: 'part-time' },
  { label: '合同工', value: 'contract' },
  { label: '自由职业', value: 'freelance' }
];

/**
 * 简化的城市政策接口（用于增强版计算器）
 */
export interface SimpleCityPolicy {
  cityCode: string;
  cityName: string;
  basicMaternityLeave: number;
  extendedMaternityLeave: number;
  difficultBirthExtraLeave: number;
  multipleBirthExtraLeave: number;
  paternityLeave: number;
  lateMarriageLeave?: number;
}

/**
 * 简化的城市政策数据（13个支持的城市）
 */
export const CITY_POLICIES: Record<string, SimpleCityPolicy> = {
  beijing: {
    cityCode: 'beijing',
    cityName: '北京',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 60,
    difficultBirthExtraLeave: 15,
    multipleBirthExtraLeave: 15,
    paternityLeave: 15,
    lateMarriageLeave: 30,
  },
  shanghai: {
    cityCode: 'shanghai',
    cityName: '上海',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 60,
    difficultBirthExtraLeave: 15,
    multipleBirthExtraLeave: 15,
    paternityLeave: 10,
  },
  guangzhou: {
    cityCode: 'guangzhou',
    cityName: '广州',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 80,
    difficultBirthExtraLeave: 30,
    multipleBirthExtraLeave: 15,
    paternityLeave: 15,
  },
  shenzhen: {
    cityCode: 'shenzhen',
    cityName: '深圳',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 80,
    difficultBirthExtraLeave: 30,
    multipleBirthExtraLeave: 15,
    paternityLeave: 15,
  },
  tianjin: {
    cityCode: 'tianjin',
    cityName: '天津',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 60,
    difficultBirthExtraLeave: 15,
    multipleBirthExtraLeave: 15,
    paternityLeave: 15,
  },
  nanjing: {
    cityCode: 'nanjing',
    cityName: '南京',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 30,
    difficultBirthExtraLeave: 15,
    multipleBirthExtraLeave: 15,
    paternityLeave: 15,
  },
  hangzhou: {
    cityCode: 'hangzhou',
    cityName: '杭州',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 30,
    difficultBirthExtraLeave: 15,
    multipleBirthExtraLeave: 15,
    paternityLeave: 15,
  },
  jinan: {
    cityCode: 'jinan',
    cityName: '济南',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 60,
    difficultBirthExtraLeave: 15,
    multipleBirthExtraLeave: 15,
    paternityLeave: 15,
  },
  qingdao: {
    cityCode: 'qingdao',
    cityName: '青岛',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 60,
    difficultBirthExtraLeave: 15,
    multipleBirthExtraLeave: 15,
    paternityLeave: 15,
  },
  wuhan: {
    cityCode: 'wuhan',
    cityName: '武汉',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 60,
    difficultBirthExtraLeave: 15,
    multipleBirthExtraLeave: 15,
    paternityLeave: 15,
  },
  changsha: {
    cityCode: 'changsha',
    cityName: '长沙',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 60,
    difficultBirthExtraLeave: 15,
    multipleBirthExtraLeave: 15,
    paternityLeave: 15,
  },
  chongqing: {
    cityCode: 'chongqing',
    cityName: '重庆',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 30,
    difficultBirthExtraLeave: 15,
    multipleBirthExtraLeave: 15,
    paternityLeave: 15,
  },
  chengdu: {
    cityCode: 'chengdu',
    cityName: '成都',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 60,
    difficultBirthExtraLeave: 15,
    multipleBirthExtraLeave: 15,
    paternityLeave: 20,
  },
};

/**
 * 根据城市代码获取政策
 * @param cityCode 城市代码
 * @returns 城市政策或默认政策
 */
export const getCityPolicy = (cityCode: string): SimpleCityPolicy => {
  return CITY_POLICIES[cityCode] || {
    cityCode: 'default',
    cityName: '默认',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 30,
    difficultBirthExtraLeave: 15,
    multipleBirthExtraLeave: 15,
    paternityLeave: 15,
  };
};
