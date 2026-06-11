import React, { useState, useEffect, useRef } from "react";
import {
  Sliders,
  Trash2,
  Plus,
  Zap,
  Lock,
  Unlock,
  RefreshCw,
  Mic,
  Layers,
  Camera,
  BrainCircuit,
  ChevronRight,
  Sun,
  Droplet,
  X,
  Maximize,
} from "lucide-react";

// 💡 1. 공식 안료 완벽 데이터베이스
const TONER_DB = {
  "WT 144": {
    role: "그리니쉬 블루",
    desc: "녹색을 띠는 청색 조색제. WT346 대체 안료임. (WT346 : WT144 = 1 : 0.9)",
  },
  "WT 154": {
    role: "블루 이펙트",
    desc: "청색으로 착색된 광휘형 알루미늄 조색제. 입자의 반짝임이 좋음. 채도가 높고 입자감이 좋은 청색계열의 컬러에 사용됨.",
  },
  "WT 188": {
    role: "슈퍼 딥 블랙",
    desc: "어두운 흑색 조색제. WT388보다 조금 더 어두움. 주로 흑색계열의 컬러에 제한적으로 사용함.",
  },
  "WT 197": {
    role: "실크 실버 울트라 파인",
    desc: "입자의 크기는 매우 작지만 반짝임이 좋은 특수 알루미늄 조색제. 매끈한 느낌의 은색에 사용됨.",
  },
  "WT 300": {
    role: "마룬",
    desc: "어두운 적색 조색제. WT332에 비해 채도가 높으며 측면(110도)을 더 어둡게 함. 주로 적색 이펙트 컬러에 사용.",
  },
  "WT 303": {
    role: "플래틴 실버 엑스트라 화인",
    desc: "매우 작은 고휘도 광휘형 알루미늄 조색제. WT389보다 작음.",
  },
  "WT 304": {
    role: "매직 스파클 이펙트",
    desc: "투명한 황색의 크고 반짝임이 매우 좋은 글라스 플레이크.",
  },
  "WT 305": {
    role: "울트라 화인 실버",
    desc: "매우 작지만 반짝임이 좋은 특수 알루미늄 조색제. 매끈한 느낌의 은색에 사용됨.",
  },
  "WT 307": {
    role: "프리즈마 실버",
    desc: "정면에서는 은색, 측면에서는 무지개 색을 내는 특수 조색제.",
  },
  "WT 308": {
    role: "브라이트 오렌지",
    desc: "주로 이펙트 컬러에 사용하는 맑은 주황색. 은폐력은 떨어짐.",
  },
  "WT 309": {
    role: "브릴리언트 마젠타",
    desc: "맑은 자주색 조색제. 주로 채도가 높은 이펙트 컬러에 사용함. 은폐력은 떨어짐.",
  },
  "WT 310": {
    role: "파우더 펄 바인더",
    desc: "파우더 펄 사용을 위한 조색제 바인더로 사용",
  },
  "WT 311": {
    role: "루비 레드",
    desc: "약하게 황색을 띠는 맑은 적색 조색제. 주로 채도 높은 적색 이펙트 컬러에 사용함. 은폐력은 떨어짐.",
  },
  "WT 312": {
    role: "매직 파이어 이펙트",
    desc: "관찰각도에 따라 색상변화가 큰 특수 펄 조색제. 15도는 맑은 적색, 45도는 맑은 녹색, 110도는 약하게 녹색으로 변하는 펄.",
  },
  "WT 315": {
    role: "엑스트라 화인 블루 펄",
    desc: "가장 작은 크기의 약하게 적색을 띠는 청색 펄 조색제. WT372 보다도 작음. 15도는 적청색, 나머지 각도(45 & 110도)는 녹황색으로 변하는 간섭 펄 입자임.",
  },
  "WT 316": {
    role: "터콰이즈 펄",
    desc: "중간 크기의 녹색을 띠는 청색 펄 조색제. 15도는 맑은 청색, 나머지 각도(45 & 110도)는 맑은 녹색으로 변하는 간섭 펄 입자임.",
  },
  "WT 317": {
    role: "플래틴 실버 브릴리언트 화인",
    desc: "WT305보다 조금 큰 반짝임이 좋은 매끄러운 특수 알루미늄 조색제. WT305 보다 15도는 밝고 나머지 각도(45 & 110도)는 어두움.",
  },
  "WT 318": {
    role: "브릴리언트 블루",
    desc: "녹색을 띠는 맑은 청색 조색제. WT346보다 밝고 녹색이 더 많음",
  },
  "WT 320": {
    role: "플래티늄 펄",
    desc: "가장 작은 크기의 백색 펄 조색제. 예) 현대 XB3, 아우디 LX7L, LX6T, BMW A96 등에 사용됨.",
  },
  "WT 321": {
    role: "화이트",
    desc: "표준 백색(고농) 조색제. 솔리드 컬러에서 명암을 밝게 하고 색상을 줄임. 이펙트 컬러에서 15도는 어둡고 나머지 각도(45 & 110도)는 밝게 함. 입자감을 줄임.",
  },
  "WT 322": {
    role: "마이크로 화이트",
    desc: "알루미늄 및 펄 입자가 사용되는 이펙트 컬러에만 사용함. 15도는 황색을 띠며 어둡고 나머지 각도(45 & 110도)는 청색을 띠며 밝게 함.",
  },
  "WT 323": {
    role: "스페셜 블랙",
    desc: "표준 흑색 조색제. 알루미늄 입자에 사용하면 명암은 어두워지고 약하게 적황색이 늘어남. 솔리드 컬러에 사용하면 명도와 채도를 낮춤.",
  },
  "WT 324": {
    role: "레디쉬 옐로우",
    desc: "적색을 띠는 맑고 채도 높은 황색 조색제. 은폐력은 떨어짐. 주로 이펙트 컬러에 사용함.",
  },
  "WT 326": {
    role: "그리니쉬 옐로우",
    desc: "이펙트 컬러에 사용하는 녹색을 띤 맑은 황색 조색제. 알루미늄 입자에 혼합하면 15도는 맑은 황색, 나머지 각도(45 & 110도)는 녹황색을 띰.",
  },
  "WT 327": {
    role: "옐로우",
    desc: "녹색을 띠는 밝은 황색 조색제. 주로 솔리드 컬러에 사용함. 이펙트 컬러에서는 특히 45 & 110도에 밝은 황색이 필요할 경우에만 소량 사용.",
  },
  "WT 328": { role: "오커", desc: "주로 솔리드 컬러에 사용하는 탁한 황색." },
  "WT 329": {
    role: "트랜스페어런트 옐로우",
    desc: "적색을 조금 띠는 선명하고 맑은 황색 조색제. 주로 이펙트 컬러에 사용. 은폐력은 떨어짐.",
  },
  "WT 330": {
    role: "블러드 오렌지",
    desc: "밝은 주황색 조색제. 주로 솔리드 컬러에 사용. 이펙트 컬러에는 특히 45 & 110도에 밝은 황적색이 부족할 경우에만 소량 사용.",
  },
  "WT 331": {
    role: "트랜스루센트 옥사이드",
    desc: "이펙트 컬러에서 맑은 적황색을 내는 조색제. 솔리드 컬러에는 사용을 금함.",
  },
  "WT 332": {
    role: "마룬",
    desc: "어두운 적색 조색제. 주로 적색 이펙트 컬러에 사용하며 전체적으로 황적색을 내고 명암을 조금 어둡게 함.",
  },
  "WT 333": {
    role: "그라나다 레드",
    desc: "밝은 적색 조색제. 주로 솔리드 컬러에 사용함. 이펙트 컬러에서 특히 45 & 110도에 적색이 부족할 경우 소량 사용됨.",
  },
  "WT 334": {
    role: "옥사이드 레드",
    desc: "주로 솔리드 컬러에 사용하는 탁한 적색 조색제. 조색제 단독으로는 은폐력 좋음. 이펙트 컬러에서 특히 45 & 110도에 황적색을 띠게 하기위해 소량 사용.",
  },
  "WT 335": {
    role: "다크 옐로우",
    desc: "적색을 조금 띠는 밝은 황색 조색제. 주로 솔리드 컬러에 사용함. 이펙트 컬러에서는 특히 45 & 110도에 밝은 녹황색이 부족할 경우에만 소량 사용.",
  },
  "WT 336": {
    role: "트랜스루센트 레드",
    desc: "선명하며 어두운 갈색 조색제. 이펙트 컬러에만 사용.",
  },
  "WT 337": {
    role: "레드",
    desc: "중간 정도의 적색 조색제. 주로 솔리드 컬러에 사용함. 약하게 청색을 띰.",
  },
  "WT 338": {
    role: "블루이쉬 마젠타 레드",
    desc: "표준 자주색 조색제. 백색 및 알루미늄 입자에 혼합할 경우 맑은 분홍색을 나타냄.",
  },
  "WT 339": {
    role: "바이올렛",
    desc: "맑은 보라색 조색제. 청색 및 회색 컬러에 주로 사용되며 보라색을 내고 명암을 어둡게 함.",
  },
  "WT 340": {
    role: "옐로우 마젠타 레드",
    desc: "맑은 자주색 조색제. WT338에 비해 밝고 청색이 적음. 주로 이펙트 컬러에 사용함. 알루미늄 입자에 혼합할 경우 맑은 분홍색을 냄.",
  },
  "WT 341": {
    role: "아주르 블루",
    desc: "채도 높은 청색 조색제. 이펙트 컬러에서 15도는 녹청색, 나머지 각도(45 & 110도)는 적청색을 띰. 관찰각도 별로 컬러의 변화가 가장 큼.",
  },
  "WT 342": {
    role: "다크 바이올렛",
    desc: "맑은 보라색 조색제. 이펙트 컬러에 사용하면 15도는 보라색, 나머지 각도(45 & 110도)는 자주색을 내는 조색제. WT339에 비해 청색이 적음.",
  },
  "WT 343": {
    role: "블루",
    desc: "표준 청색 조색제. 솔리드와 이펙트 컬러에 모두 사용하는 중간 청색 조색제.",
  },
  "WT 344": {
    role: "다크 블루",
    desc: "어두운 청색 조색제. 이펙트 컬러에서 15도는 청색, 나머지 각도(45 & 110도)는 적색을 띰. 청색 조색제 중 가장 어두움.",
  },
  "WT 345": {
    role: "트랜스페어런트 에메랄드",
    desc: "맑고 선명한 황색을 조금 띠는 녹색 조색제. WT347에 비해 밝고 황색이 많음.",
  },
  "WT 346": {
    role: "트랜스페어런트 딥 블루",
    desc: "녹색을 띠는 청색 조색제. 특히 45 & 110도에서 녹색이 가장 많은 청색 조색제. 이펙트 컬러에 가장 많이 사용하는 청색임.",
  },
  "WT 347": {
    role: "트랜스페어런트 그린",
    desc: "청색을 조금 띠는 녹색 조색제. WT345에 비해 청색이 많고 어두움.",
  },
  "WT 348": {
    role: "트랜스페어런트 아주르 블루",
    desc: "채도 높은 청색 조색제. 이펙트 컬러에서 15도는 녹색이 강한 청색, 나머지 각도(45 & 110도)는 약하게 적색을 띰.",
  },
  "WT 349": {
    role: "트랜스루센트 그린",
    desc: "녹색 저농 조색제. WT347의 저농 버전. (WT349 : WT347 = 10.52 : 1)",
  },
  "WT 350": {
    role: "트랜스루센트 블랙",
    desc: "저농 흑색 조색제. WT323의 저농 버전. (WT350 : WT323 = 2.89 : 1)",
  },
  "WT 351": {
    role: "트랜스루센트 아주르 블루",
    desc: "저농 청색 조색제. WT348의 저농 버전. (WT351 : WT348 = 8.7 : 1)",
  },
  "WT 352": {
    role: "트랜스루센트 화이트",
    desc: "저농 백색 조색제. WT321의 저농 버전. (WT352 : WT321 = 7.69 : 1)",
  },
  "WT 353": {
    role: "트랜스루센트 마젠타 레드",
    desc: "저농 자주색 조색제. WT338의 저농 버전. (WT353 : WT338 = 5.68 : 1)",
  },
  "WT 354": {
    role: "화인 실버",
    desc: "매우 작은 크기의 일반형 알루미늄 조색제. WT356 보다 작음.",
  },
  "WT 355": {
    role: "브릴리언트 실버 코올스",
    desc: "가장 큰 광휘형 알루미늄 조색제. 은폐력은 떨어짐.",
  },
  "WT 356": {
    role: "미디움 실버",
    desc: "중간 크기의 일반형 알루미늄 조색제.",
  },
  "WT 357": {
    role: "마이크로 실버",
    desc: "입자가 작은 일반형 알루미늄 조색제. WT356보다 15도는 어둡고, 나머지 각도(45 & 110도)는 밝음.",
  },
  "WT 358": { role: "스페셜 실버", desc: "이펙트 컬러용 특수 실버 조색제" },
  "WT 359": {
    role: "브라이트 실버",
    desc: "WT356보다 큰 일반형 알루미늄 조색제. WT356 보다 15도는 밝고, 나머지 각도(45 & 110도)는 어두움.",
  },
  "WT 360": {
    role: "코올스 실버",
    desc: "WT359보다 큰 일반형 알루미늄 조색제. WT359보다 15도는 밝고 나머지 각도(45 & 110도)는 어두움.",
  },
  "WT 361": {
    role: "브릴리언트 실버",
    desc: "WT362보다 큰 광휘형 알루미늄 조색제. WT362보다 15도는 밝고 나머지 각도(45 & 110도)는 어두움.",
  },
  "WT 362": {
    role: "브릴리언트 실버 화인",
    desc: "작은 크기의 광휘형 알루미늄 조색제. WT361에 비해 크기가 작음.",
  },
  "WT 363": {
    role: "브릴리언트 골드",
    desc: "밝은 황색 알루미늄 조색제. 은폐력이 우수함.",
  },
  "WT 364": { role: "화이트 펄", desc: "큰 크기의 백색 펄 조색제." },
  "WT 365": {
    role: "라일락 펄",
    desc: "중간 크기의 자주색 펄 조색제. 15도는 청적색, 나머지 각도(45 & 110도)는 황녹색으로 변하는 간섭 펄 입자임.",
  },
  "WT 366": {
    role: "골드 펄",
    desc: "중간 크기의 황색 펄 조색제. 15도는 황색, 나머지 각도(45 & 110도)는 청색으로 변하는 간섭 펄 입자임.",
  },
  "WT 367": {
    role: "화인 그린 펄",
    desc: "작은 크기의 녹색 펄 조색제. 15도는 녹색, 나머지 각도(45 & 110도)는 적색으로 변하는 간섭 펄 입자임.",
  },
  "WT 368": { role: "화인 화이트 펄", desc: "중간 크기의 백색 펄 조색제." },
  "WT 369": {
    role: "레드 펄",
    desc: "작은 크기의 적색 펄 조색제. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임. 적색 입자감 있는 컬러에 적용하며, 다른 펄보다 은폐력이 있음.",
  },
  "WT 370": {
    role: "브라이트 블루 펄",
    desc: "큰 크기의 맑은 청색 펄 조색제. 15도는 녹청색, 나머지 각도(45 & 110도)는 적황색으로 변하는 간섭 펄 입자임.",
  },
  "WT 371": {
    role: "브라운 펄",
    desc: "중간 크기의 주황색 펄 조색제. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임.",
  },
  "WT 372": {
    role: "화인 블루 펄",
    desc: "WT370보다 작은 적색이 있는 청색 펄 조색제. 15도는 적청색, 나머지 각도(45 & 110도)는 녹황색으로 변하는 간섭 펄 입자임.",
  },
  "WT 373": {
    role: "루비 펄",
    desc: "중간 크기의 은폐력이 있는 적색 펄 조색제. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임.",
  },
  "WT 374": {
    role: "블루 그린 펄",
    desc: "중간 크기의 청녹색 펄 조색제. 15도는 청녹색, 나머지 각도(45 & 110도)는 황적색으로 변하는 간섭 펄 입자임.",
  },
  "WT 375": {
    role: "그린 펄",
    desc: "중간 크기의 녹색 펄 조색제. 15도는 맑은 녹색, 나머지 각도(45 & 110도)는 적색으로 변하는 간섭 펄 입자임.",
  },
  "WT 376": {
    role: "레드펄 엑스트라",
    desc: "중간 크기의 적색 펄 조색제. 15도는 적색, 나머지 각도(45 & 110도)는 녹색으로 변하는 간섭 펄 입자임.",
  },
  "WT 377": {
    role: "다이아몬드 화이트",
    desc: "질라릭 백색 펄 조색제. 입자의 반짝임이 매우 좋음. 15도는 약하게 녹색을 띠며 나머지 각도는 약하게 적색을 띰.",
  },
  "WT 378": {
    role: "다이아몬드 레드",
    desc: "질라릭 적색 펄 조색제. 입자의 반짝임이 매우 좋음. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임.",
  },
  "WT 379": {
    role: "다이아몬드 카퍼",
    desc: "질라릭 주황색 펄 조색제. 입자의 반짝임이 매우 좋음. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임.",
  },
  "WT 380": {
    role: "다이아몬드 그린",
    desc: "질라릭 녹색 펄 조색제. 입자의 반짝임이 매우 좋음. 15도는 녹색, 나머지 각도(45 & 110도)는 적색으로 변하는 간섭 펄 입자임.",
  },
  "WT 381": {
    role: "다이아몬드 블루",
    desc: "질라릭 청색 펄 조색제. 입자의 반짝임이 매우 좋음. 15도는 청색, 나머지 각도(45 & 110도)는 황색으로 변하는 간섭 펄 입자임.",
  },
  "WT 382": {
    role: "다이아몬드 골드",
    desc: "질라릭 황색 펄 조색제. 입자의 반짝임이 매우 좋음. 15도는 황색, 나머지 각도(45 & 110도)는 청색으로 변하는 간섭 펄 입자임.",
  },
  "WT 383": {
    role: "브릴리언트 오렌지",
    desc: "WT363에 비해 적색감이 많은 적황색 알루미늄 조색제.",
  },
  "WT 385": {
    role: "시스템 컴포넌트 A",
    desc: "Transparent White. WT387에 비해 점도가 높음.",
  },
  "WT 386": { role: "플롭 컨트롤", desc: "측면을 밝게 하기 위한 명암 조정제." },
  "WT 387": { role: "시스템 컴포넌트 B", desc: "Viscosity Additive" },
  "WT 388": {
    role: "슈퍼 딥 블랙",
    desc: "어두운 흑색 조색제. WT323보다 어두움. 주로 흑색계열의 컬러에 제한적으로 사용함.",
  },
  "WT 389": {
    role: "플래틴 실버 화인",
    desc: "작은 고휘도 광휘형 알루미늄 조색제. WT303보다 크고 WT390보다 작음.",
  },
  "WT 390": {
    role: "플래틴 실버",
    desc: "중간 크기의 고휘도 광휘형 알루미늄 조색제. WT389보다 큼. 알루미늄 입자 중 15도가 가장 밝고 나머지 각도(45 & 110도)가 가장 어두움.",
  },
  "WT 392": {
    role: "매직 이펙트",
    desc: "관찰각도에 따라 색상변화가 큰 특수 펄 조색제. 색상이 WT312의 반대로 변함. 15도는 맑은 녹색, 45도는 맑은 적색, 110도는 약하게 적색으로 변하는 펄.",
  },
  "WT 393": {
    role: "라이트 옐로우",
    desc: "약하게 녹색을 띠는 밝은 황색 조색제. WT327에 비해 녹색이 적음. 주로 솔리드 컬러에 사용함. 이펙트 컬러에서 특히 45 & 110도에 밝은 황색이 필요할 경우에만 소량 사용.",
  },
  "WT 1051": { role: "블랜딩 1051", desc: "블랜드인 첨가제, 블랜딩용 첨가제." },
  "WT 1500": {
    role: "울트라 딥 블랙",
    desc: "가장 어두운 흑색 조색제. 염료를 함유하고 있어 알루미늄 입자에 2% 이상 사용하면 알루미늄 입자와 반응하여 색상이 변할 수 있고 내구성에도 문제가 될 수 있음(솔리드: 최대 5%, 실버: 최대 2%, 펄: 최대 5% 이내 사용)",
  },
  "WT 455": {
    role: "퍼포먼스 컴포넌트",
    desc: "솔리드 컬러에만 사용하는 첨가제. WT455를 베이스코트 무게의 10% 혼합하면 특히 겨울과 같은 낮은 습도 조건에서 작업성이 좋아지며 외관도 개선됨.",
  },
  "WT 3080": { role: "스페셜 애디티브", desc: "도막 보정 및 흐름 방지 첨가제" },
};

// 보간용 수학 함수 모음
const lerp = (a, b, t) => a + (b - a) * t;
const lerpHue = (a, b, t) => {
  let d = b - a;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  let h = a + d * t;
  if (h < 0) h += 360;
  if (h >= 360) h -= 360;
  return h;
};
const lerpColor = (c1, c2, t) => ({
  h: lerpHue(c1.h, c2.h, t),
  s: lerp(c1.s, c2.s, t),
  l: lerp(c1.l, c2.l, t),
});

// 실제 사진 뷰어 모사를 위한 이중 광학 처리
const getTonerVisuals = (code, role, desc = "") => {
  const isPearl =
    role.includes("펄") || role.includes("이펙트") || role.includes("글라스");
  const isSilver = role.includes("실버") || role.includes("알루미늄");
  const isSolid = !isPearl && !isSilver;

  let faceColor = "#e2e8f0";
  let particleColor1 = "#ffffff";
  let particleColor2 = "#94a3b8";

  if (role.includes("블루") || role.includes("청")) {
    faceColor = "#1d4ed8";
    particleColor1 = "#60a5fa";
    particleColor2 = "#3b82f6";
  } else if (
    role.includes("레드") ||
    role.includes("마젠타") ||
    role.includes("마룬") ||
    code.includes("300")
  ) {
    faceColor = "#b91c1c";
    particleColor1 = "#f87171";
    particleColor2 = "#ef4444";
  } else if (role.includes("그린") || role.includes("녹")) {
    faceColor = "#15803d";
    particleColor1 = "#4ade80";
    particleColor2 = "#22c55e";
  } else if (
    role.includes("옐로우") ||
    role.includes("황") ||
    role.includes("오커")
  ) {
    faceColor = "#eab308";
    particleColor1 = "#fde047";
    particleColor2 = "#ca8a04";
  } else if (role.includes("오렌지")) {
    faceColor = "#ea580c";
    particleColor1 = "#fb923c";
    particleColor2 = "#f97316";
  } else if (role.includes("바이올렛")) {
    faceColor = "#7e22ce";
    particleColor1 = "#c084fc";
    particleColor2 = "#a855f7";
  } else if (role.includes("화이트") || role.includes("백")) {
    faceColor = "#f8fafc";
    particleColor1 = "#ffffff";
    particleColor2 = "#cbd5e1";
  } else if (role.includes("블랙") || role.includes("흑")) {
    faceColor = "#0f172a";
    particleColor1 = "#475569";
    particleColor2 = "#334155";
  } else if (isSilver) {
    faceColor = "#94a3b8";
    particleColor1 = "#ffffff";
    particleColor2 = "#f1f5f9";
  }

  let flopColor = "#1e293b";
  if (isSolid) {
    flopColor = faceColor;
  } else {
    if (desc.includes("녹황색") || desc.includes("황녹색")) {
      flopColor = "#65a30d";
      particleColor2 = "#84cc16";
    } else if (desc.includes("적황색") || desc.includes("황적색")) {
      flopColor = "#ea580c";
      particleColor2 = "#f97316";
    } else if (
      desc.includes("적색") ||
      desc.includes("마젠타") ||
      desc.includes("적청색")
    ) {
      flopColor = "#991b1b";
      particleColor2 = "#f43f5e";
    } else if (desc.includes("녹색") || desc.includes("청녹색")) {
      flopColor = "#166534";
      particleColor2 = "#22c55e";
    } else if (desc.includes("청색") || desc.includes("적청색")) {
      flopColor = "#1e3a8a";
      particleColor2 = "#3b82f6";
    } else if (desc.includes("황색")) {
      flopColor = "#b45309";
      particleColor2 = "#facc15";
    } else if (isSilver) flopColor = "#334155";
  }

  let size = 30;
  if (
    role.includes("엑스트라 화인") ||
    role.includes("울트라 파인") ||
    role.includes("마이크로") ||
    desc.includes("매우 작")
  )
    size = 15;
  else if (
    role.includes("코올스") ||
    role.includes("큰") ||
    role.includes("스파클")
  )
    size = 60;

  if (
    role.includes("바인더") ||
    role.includes("컴포넌트") ||
    role.includes("애디티브") ||
    code.includes("385") ||
    code.includes("387")
  ) {
    return {
      smoothStyle: {
        background: "rgba(255,255,255,0.8)",
        border: "1px dashed #cbd5e1",
      },
      macroStyle: {
        background: "rgba(255,255,255,0.8)",
        border: "1px dashed #cbd5e1",
      },
    };
  }

  let smoothStyle, macroStyle;
  if (isSolid) {
    smoothStyle = {
      background: `linear-gradient(135deg, ${faceColor} 0%, rgba(0,0,0,0.4) 100%)`,
    };
    macroStyle = { backgroundColor: faceColor };
  } else {
    smoothStyle = {
      background: `linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)`,
    };
    macroStyle = {
      backgroundColor: "#020617",
      backgroundImage: `radial-gradient(circle at 10% 20%, ${particleColor1} 1px, transparent 2px), radial-gradient(circle at 30% 60%, ${particleColor2} 1.5px, transparent 2.5px), radial-gradient(circle at 70% 30%, ${particleColor1} 0.5px, transparent 1px), radial-gradient(circle at 80% 80%, ${particleColor2} 2px, transparent 3px), radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 2px)`,
      backgroundSize: `${size}px ${size}px`,
      boxShadow: "inset 0 0 15px rgba(0,0,0,0.9)",
    };
  }
  return { smoothStyle, macroStyle };
};

// 백색 펄 시편 광학 엔진
const getOptics = (tonersList, weightKey) => {
  const colorToners = tonersList.filter(
    (t) => !t.role.includes("지정되지 않은")
  );
  const sumW = colorToners.reduce(
    (sum, t) => sum + (parseFloat(t[weightKey]) || 0),
    0
  );

  if (sumW === 0)
    return {
      face: { h: 0, s: 0, l: 90 },
      mid: { h: 0, s: 0, l: 90 },
      flop: { h: 0, s: 0, l: 90 },
      isMetallic: false,
    };

  let rBlue = 0,
    rGreen = 0,
    rRed = 0,
    rYellow = 0,
    rViolet = 0;
  let wSilver = 0,
    wWhite = 0,
    wBlack = 0,
    wPearl = 0,
    wBinder = 0;
  let interferenceColor = null;

  colorToners.forEach((t) => {
    const w = parseFloat(t[weightKey]) || 0;
    if (w <= 0) return;
    const role = t.role || "";
    const code = t.code || "";
    let strength = 1.0;
    if (
      code.includes("144") ||
      code.includes("341") ||
      code.includes("300") ||
      code.includes("338")
    )
      strength = 2.5;

    if (
      role.includes("컴포넌트") ||
      role.includes("바인더") ||
      role.includes("애디티브") ||
      ["WT 385", "WT 387", "WT 386", "WT 400", "WT 3080", "WT 310"].some((c) =>
        code.includes(c.replace("WT ", ""))
      )
    )
      wBinder += w;
    else if (
      role.includes("블랙") ||
      code.includes("323") ||
      code.includes("388") ||
      code.includes("188")
    )
      wBlack += w;
    else if (
      role.includes("실버") ||
      role.includes("알루미늄") ||
      code.includes("362") ||
      code.includes("357") ||
      code.includes("197") ||
      code.includes("303") ||
      code.includes("305") ||
      code.includes("307")
    )
      wSilver += w;
    else if (
      role.includes("화이트") ||
      code.includes("321") ||
      code.includes("328")
    )
      wWhite += w;
    else if (
      role.includes("펄") ||
      role.includes("이펙트") ||
      role.includes("스파클") ||
      code.includes("304") ||
      code.includes("377") ||
      code.includes("381")
    ) {
      wPearl += w;
      if (role.includes("블루") || code.includes("381")) {
        interferenceColor = "blue";
        rBlue += w * 0.15;
      } else if (role.includes("레드") || role.includes("마젠타")) {
        interferenceColor = "red";
        rRed += w * 0.15;
      } else if (role.includes("그린")) {
        interferenceColor = "green";
        rGreen += w * 0.15;
      } else if (role.includes("골드") || code.includes("304")) {
        interferenceColor = "yellow";
        rYellow += w * 0.15;
      } else if (role.includes("화이트") || code.includes("377"))
        interferenceColor = "white";
    } else if (
      code.includes("144") ||
      role.includes("블루") ||
      role.includes("청")
    ) {
      rBlue += w * strength;
      rGreen += w * strength * 0.5;
    } else if (code.includes("339") || role.includes("바이올렛"))
      rViolet += w * strength;
    else if (
      code.includes("353") ||
      code.includes("309") ||
      role.includes("마젠타")
    ) {
      rRed += w * strength;
      rViolet += w * strength * 0.5;
    } else if (
      code.includes("300") ||
      role.includes("마룬") ||
      role.includes("적")
    )
      rRed += w * strength;
    else if (code.includes("308") || role.includes("오렌지")) {
      rRed += w * strength;
      rYellow += w * strength * 0.5;
    } else if (
      role.includes("옐로우") ||
      role.includes("황") ||
      code.includes("350")
    )
      rYellow += w * strength;
    else if (role.includes("그린") || role.includes("녹"))
      rGreen += w * strength;
  });

  const colorWeight = rBlue + rGreen + rRed + rYellow + rViolet;
  const effectiveW = wWhite + wBlack + wSilver + wPearl + colorWeight;
  const totalForRatio = effectiveW > 0 ? effectiveW : 1;

  const pSilver = wSilver / totalForRatio;
  const pWhite = wWhite / totalForRatio;
  const pBlack = wBlack / totalForRatio;
  const pPearl = wPearl / totalForRatio;
  const pColor = colorWeight / totalForRatio;

  let baseL = pWhite * 96 + pSilver * 65 + pPearl * 85;
  if (effectiveW === 0 && wBinder > 0) baseL = 90;

  let blackImpact = Math.pow(pBlack, 0.45) * 60;
  if (pWhite > 0.6) blackImpact = blackImpact * 0.15;
  const colorImpactL = Math.pow(pColor, 0.5) * 30;
  baseL = Math.max(4, baseL - blackImpact - colorImpactL);

  let l15 = baseL + Math.pow(pSilver + pPearl, 0.6) * 45;
  let l110 = baseL - Math.pow(pSilver, 0.6) * 45 - Math.pow(pBlack, 0.5) * 20;

  if (pWhite > 0.6) {
    l110 = Math.max(83, baseL - 8);
    l15 = Math.min(99, baseL + (pPearl > 0 ? 10 : 3));
  }

  let x = rRed + rYellow * 0.5 - rGreen * 0.5 - rBlue - rViolet * 0.5;
  let y = rYellow * 0.866 + rGreen * 0.866 - rBlue * 0.866 - rViolet * 0.866;
  let hue = Math.atan2(y, x) * (180 / Math.PI);
  if (hue < 0) hue += 360;

  let sat =
    colorWeight > 0
      ? Math.min(
          100,
          Math.pow(
            colorWeight /
              (colorWeight + wWhite + wSilver + Math.max(wBlack * 2, 0)),
            0.4
          ) * 100
        )
      : 0;
  if (pWhite > 0.6) sat = sat * 0.3;

  let flopHue = hue;
  let faceHue = hue;
  if (interferenceColor === "blue") {
    faceHue = 210;
    flopHue = 230;
  } else if (interferenceColor === "red") {
    faceHue = 340;
    flopHue = 350;
  } else if (interferenceColor === "green") {
    faceHue = 120;
    flopHue = 140;
  } else if (interferenceColor === "yellow") {
    faceHue = 50;
    flopHue = 60;
  }

  let faceSat = Math.min(
    100,
    sat + pPearl * (interferenceColor === "white" ? 5 : 20)
  );
  let flopSat = Math.min(
    100,
    sat + pPearl * (interferenceColor === "white" ? 2 : 12)
  );

  if (colorWeight === 0 && wPearl === 0) {
    hue = 0;
    flopHue = 0;
    faceHue = 0;
    sat = 0;
    faceSat = 0;
    flopSat = 0;
  }

  return {
    face: {
      h: Math.round(faceHue),
      s: Math.round(faceSat),
      l: Math.round(Math.min(99, Math.max(5, l15))),
    },
    mid: {
      h: Math.round(hue),
      s: Math.round(sat),
      l: Math.round(Math.min(98, Math.max(5, baseL))),
    },
    flop: {
      h: Math.round(wPearl > 0 ? flopHue : hue),
      s: Math.round(flopSat),
      l: Math.round(Math.min(98, Math.max(2, l110))),
    },
    isMetallic: wSilver > 0 || wPearl > 0,
  };
};

export default function App() {
  const [toners, setToners] = useState([
    {
      id: "WT387",
      code: "WT 387",
      role: TONER_DB["WT 387"].role,
      adjustedWeight: "148",
    },
    {
      id: "WT321",
      code: "WT 321",
      role: TONER_DB["WT 321"].role,
      adjustedWeight: "88.5",
    },
    {
      id: "WT350",
      code: "WT 350",
      role: TONER_DB["WT 350"].role,
      adjustedWeight: "1.9",
    },
    {
      id: "WT328",
      code: "WT 328",
      role: TONER_DB["WT 328"].role,
      adjustedWeight: "0.5",
    },
    {
      id: "WT3080",
      code: "WT 3080",
      role: TONER_DB["WT 3080"].role,
      adjustedWeight: "12",
    },
  ]);

  const [pearlToners, setPearlToners] = useState([
    {
      id: "WT387_p",
      code: "WT 387",
      role: TONER_DB["WT 387"].role,
      adjustedWeight: "155",
    },
    {
      id: "WT385_p",
      code: "WT 385",
      role: TONER_DB["WT 385"].role,
      adjustedWeight: "38.7",
    },
    {
      id: "WT377_p",
      code: "WT 377",
      role: TONER_DB["WT 377"].role,
      adjustedWeight: "9",
    },
    {
      id: "WT386_p",
      code: "WT 386",
      role: TONER_DB["WT 386"].role,
      adjustedWeight: "20.4",
    },
    {
      id: "WT381_p",
      code: "WT 381",
      role: TONER_DB["WT 381"].role,
      adjustedWeight: "3.6",
    },
  ]);

  const [isThreeCoatMode, setIsThreeCoatMode] = useState(true);
  const [targetColorCode, setTargetColorCode] = useState("FORD-UG PLATINUM");

  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00");
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00");
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");

  const [isBaseConfirmed, setIsBaseConfirmed] = useState(false);
  const [selectedTonerForView, setSelectedTonerForView] = useState(null);

  // 🎙️ 음성 인식(STT) 상태
  const [isListening, setIsListening] = useState(false);

  const initialChat = {
    id: 1,
    type: "system",
    text: "💡 **[HI-TEC Master Engine V3.0 모바일 로드 완료]**\n- 현장 작업자를 위한 아이폰 최적화 UI 적용.\n- 마이크 버튼을 눌러 음성으로 제어하세요.",
    time: new Date().toLocaleTimeString("ko-KR"),
  };
  const [chatMessages, setChatMessages] = useState([initialChat]);
  const [chatInput, setChatInput] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const chatContainerRef = useRef(null);

  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isDraggingLight, setIsDraggingLight] = useState(false);
  const viewerRef = useRef(null);

  const [baseOptics, setBaseOptics] = useState({
    face: { h: 0, s: 0, l: 90 },
    mid: { h: 0, s: 0, l: 90 },
    flop: { h: 0, s: 0, l: 90 },
    isMetallic: false,
  });
  const [pearlOptics, setPearlOptics] = useState({
    face: { h: 0, s: 0, l: 90 },
    mid: { h: 0, s: 0, l: 90 },
    flop: { h: 0, s: 0, l: 90 },
    isMetallic: false,
  });
  const [finalOptics, setFinalOptics] = useState({
    face: { h: 0, s: 0, l: 90 },
    mid: { h: 0, s: 0, l: 90 },
    flop: { h: 0, s: 0, l: 90 },
    isMetallic: false,
  });

  useEffect(() => {
    const baseTotal = toners.reduce(
      (sum, t) => sum + (parseFloat(t.adjustedWeight) || 0),
      0
    );
    const pearlTotal = pearlToners.reduce(
      (sum, t) => sum + (parseFloat(t.adjustedWeight) || 0),
      0
    );
    setTotalBaseWeight(baseTotal.toFixed(2));
    setTotalPearlWeight(pearlTotal.toFixed(2));
    setTotalFinalWeight((baseTotal + pearlTotal).toFixed(2));
    setBaseOptics(getOptics(toners, "adjustedWeight"));
    setPearlOptics(getOptics(pearlToners, "adjustedWeight"));
    const activeToners = isThreeCoatMode ? [...toners, ...pearlToners] : toners;
    setFinalOptics(getOptics(activeToners, "adjustedWeight"));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current)
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
    };
    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [chatMessages, isAiProcessing]);

  // 🎙️ 사파리용 음성 인식 엔진 실행
  const handleVoiceCommand = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "아이폰 설정 > 사파리에서 마이크 권한을 허용하거나 최신 iOS로 업데이트 해주세요."
      );
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
    };
    recognition.onerror = (event) => {
      console.error("음성 인식 오류:", event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handlePointerMove = (e) => {
    if (!isDraggingLight || !viewerRef.current) return;
    const rect = viewerRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;
    setLightPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const addChatMessage = (type, text) =>
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type,
        text,
        time: new Date().toLocaleTimeString("ko-KR"),
      },
    ]);

  const handleClearAll = () => {
    setToners([]);
    setPearlToners([]);
    setTargetColorCode("");
    setIsBaseConfirmed(false);
    addChatMessage("system", "🗑️ 모든 배합 리스트가 초기화되었습니다.");
  };

  const handleConfirmBase = () => {
    setIsBaseConfirmed(true);
    addChatMessage(
      "system",
      "🔒 기준 코드가 확정되었습니다. 멀티 시각화 렌더링이 활성화됩니다."
    );
  };

  const handleAskSolution = () => {
    if (!chatInput.trim()) return;
    const q = chatInput;
    addChatMessage("user", q);
    setChatInput("");
    setIsAiProcessing(true);

    setTimeout(() => {
      let advice = "";
      const isIncrease = q.match(/(추가|올리|높이|많이|더|플러스)/);
      const isDecrease = q.match(/(빼|줄이|낮추|적게|덜|마이너스|감소)/);

      const activeToners = isThreeCoatMode
        ? [...toners, ...pearlToners]
        : toners;
      let currR = 0,
        currB = 0,
        currY = 0,
        currG = 0,
        currW = 0,
        currS = 0,
        currBk = 0;
      activeToners.forEach((t) => {
        const w = parseFloat(t.adjustedWeight) || 0;
        if (w <= 0) return;
        const r = t.role || "";
        const c = t.code || "";
        if (
          r.includes("레드") ||
          r.includes("마젠타") ||
          r.includes("마룬") ||
          c.includes("300")
        )
          currR += w;
        else if (
          r.includes("블루") ||
          r.includes("청") ||
          c.includes("144") ||
          c.includes("341")
        )
          currB += w;
        else if (
          r.includes("옐로우") ||
          r.includes("황") ||
          r.includes("오커") ||
          c.includes("328")
        )
          currY += w;
        else if (r.includes("그린") || r.includes("녹")) currG += w;
        else if (
          r.includes("화이트") ||
          r.includes("백") ||
          c.includes("321") ||
          c.includes("322")
        )
          currW += w;
        else if (
          r.includes("실버") ||
          r.includes("알루미늄") ||
          c.includes("35")
        )
          currS += w;
        else if (
          r.includes("블랙") ||
          r.includes("흑") ||
          c.includes("323") ||
          c.includes("350")
        )
          currBk += w;
      });

      const maxTotal = currR + currB + currY + currG + currW + currS + currBk;
      let baseTone = "알 수 없음";
      if (maxTotal > 0) {
        const maxVal = Math.max(
          currR,
          currB,
          currY,
          currG,
          currW,
          currS,
          currBk
        );
        if (maxVal === currW && maxVal > maxTotal * 0.4) baseTone = "화이트";
        else if (maxVal === currS && maxVal > maxTotal * 0.4)
          baseTone = "실버/메탈릭";
        else if (maxVal === currBk && maxVal > maxTotal * 0.3)
          baseTone = "블랙/다크";
        else {
          const maxColorVal = Math.max(currR, currB, currY, currG);
          if (maxColorVal === currR) baseTone = "레드/마젠타";
          else if (maxColorVal === currB) baseTone = "블루";
          else if (maxColorVal === currY) baseTone = "옐로우/오커";
          else if (maxColorVal === currG) baseTone = "그린";
        }
      }

      const regex =
        /(?:WT\s*)?(\d{3,4})(?:[-x*\s]*(?:을|를)?\s*([0-9.]+)[gG]?)?/gi;
      let match;
      const foundToners = [];
      while ((match = regex.exec(q)) !== null)
        foundToners.push({ code: match[1], weight: match[2] });

      if (foundToners.length > 0 && (isIncrease || isDecrease)) {
        const action = isIncrease ? "증가" : "감소";
        advice = `⚡ **[조색 시뮬레이션: ${action} 타격 브리핑]**\n\n`;
        foundToners.forEach((item) => {
          let finalKey = `WT ${item.code}`;
          if (!TONER_DB[finalKey] && item.code.length >= 4)
            finalKey = `WT ${item.code.substring(0, 3)}`;
          const tonerInfo = TONER_DB[finalKey];

          if (tonerInfo) {
            const currentWeightDelta = parseFloat(item.weight) || 0.5;
            const existingToner = activeToners.find(
              (t) => t.code.replace("WT ", "") === finalKey.replace("WT ", "")
            );
            const oldWeight = existingToner
              ? parseFloat(existingToner.adjustedWeight)
              : 0;
            const newWeight =
              action === "증가"
                ? oldWeight + currentWeightDelta
                : Math.max(0, oldWeight - currentWeightDelta);

            advice += `🎯 **${finalKey} [${tonerInfo.role}]** ${action}\n`;
            advice += `▪️ **비율 변화:** 기존 ${oldWeight}g ➡️ **${newWeight.toFixed(
              2
            )}g**\n`;
            advice += `▪️ **분석:** 전체 베이스(${baseTone})에 작용하여 색상 트래블이 변경됩니다.\n\n`;
          } else {
            advice += `⚠️ **WT ${item.code}**: DB 미확인 코드\n\n`;
          }
        });
      } else {
        advice = `💡 **[현장 AI 지원 중]**\n"WT144 0.5g 추가해줘" 와 같이 음성으로 말씀하시면 즉각적으로 시뮬레이션을 돌려드립니다.`;
      }
      setIsAiProcessing(false);
      addChatMessage("ai", advice);
    }, 600);
  };

  const processWeightInput = (rawValue) => {
    let val = rawValue.replace(/[^0-9.]/g, "");
    const parts = val.split(".");
    if (parts.length > 2) val = parts[0] + "." + parts.slice(1).join("");
    if (val.length > 1 && val.startsWith("0") && val[1] !== ".")
      val = val.replace(/^0+/, "");
    if (val.startsWith(".")) val = "0" + val;
    return val;
  };

  const handleWeightInputChange = (id, rawValue, isPearl = false) => {
    const cleanValue = processWeightInput(rawValue);
    if (isPearl)
      setPearlToners(
        pearlToners.map((t) =>
          t.id === id ? { ...t, adjustedWeight: cleanValue } : t
        )
      );
    else
      setToners(
        toners.map((t) =>
          t.id === id ? { ...t, adjustedWeight: cleanValue } : t
        )
      );
  };

  const handleCodeChange = (id, newCode, isPearl = false) => {
    const formattedCode = newCode.toUpperCase().trim();
    const targetToners = isPearl ? pearlToners : toners;
    const setter = isPearl ? setPearlToners : setToners;

    setter(
      targetToners.map((toner) => {
        if (toner.id === id) {
          let matchedTonerInfo = TONER_DB[formattedCode];
          let finalCode = formattedCode;
          if (!matchedTonerInfo) {
            const numMatch = formattedCode.match(/\d+/);
            if (numMatch) {
              finalCode = `WT ${numMatch[0]}`;
              matchedTonerInfo = TONER_DB[finalCode] || {
                role: "지정되지 않은 안료",
                desc: `DB에 없습니다.`,
              };
            }
          }
          return matchedTonerInfo
            ? { ...toner, code: finalCode, role: matchedTonerInfo.role }
            : { ...toner, code: newCode, role: "코드 입력" };
        }
        return toner;
      })
    );
  };

  const removeToner = (id, isPearl = false) => {
    if (isPearl) setPearlToners(pearlToners.filter((t) => t.id !== id));
    else setToners(toners.filter((t) => t.id !== id));
  };

  const addToner = (isPearl = false) => {
    const newToner = {
      id: `new_${Date.now()}`,
      code: "",
      role: "안료 코드 입력",
      adjustedWeight: "",
    };
    if (isPearl) setPearlToners([...pearlToners, newToner]);
    else setToners([...toners, newToner]);
  };

  const getColorString = (opticsObj, angle) =>
    `hsl(${Math.round(opticsObj[angle].h)}, ${Math.round(
      opticsObj[angle].s
    )}%, ${Math.round(opticsObj[angle].l)}%)`;

  const getInteractiveBackground = (opticsObj, lPos) => {
    const dist = Math.sqrt(Math.pow(lPos.x - 50, 2) + Math.pow(lPos.y - 50, 2));
    const normalizedDist = Math.min(1, dist / 50);
    let activeColor;
    if (normalizedDist < 0.5)
      activeColor = lerpColor(
        opticsObj.face,
        opticsObj.mid,
        normalizedDist * 2
      );
    else
      activeColor = lerpColor(
        opticsObj.mid,
        opticsObj.flop,
        (normalizedDist - 0.5) * 2
      );

    const colorStr = `hsl(${Math.round(activeColor.h)}, ${Math.round(
      activeColor.s
    )}%, ${Math.round(activeColor.l)}%)`;
    const isLight = opticsObj.mid.l > 80;
    const highlightStr = isLight
      ? `rgba(255,255,255,${lerp(1, 0.4, normalizedDist)})`
      : `rgba(255,255,255,${lerp(0.9, 0.2, normalizedDist)})`;
    const shadowStr = `hsl(${Math.round(activeColor.h)}, ${Math.round(
      activeColor.s
    )}%, ${Math.round(
      isLight ? lerp(90, 70, normalizedDist) : lerp(10, 0, normalizedDist)
    )}%)`;

    return `radial-gradient(circle at ${lPos.x}% ${
      lPos.y
    }%, ${highlightStr} 0%, ${colorStr} ${lerp(
      30,
      60,
      normalizedDist
    )}%, ${shadowStr} 100%)`;
  };

  return (
    // 모바일 스크롤이 자연스럽도록 min-h-screen pb-24 적용
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden pb-24">
      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <h1 className="text-xl font-semibold">
            <span className="text-white tracking-wide">HI-TEC</span>
            <span className="text-blue-400 font-normal ml-2">App</span>
          </h1>
        </div>
      </header>

      {/* 모바일에 맞게 grid가 1단으로 쌓이도록 구성 */}
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor */}
        <div className="lg:col-span-7 flex flex-col bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <Sliders className="text-blue-600 mr-2" size={20} />
                배합 에디터
              </h2>
              {isBaseConfirmed && (
                <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-2 py-1 rounded flex items-center">
                  <Lock size={12} className="mr-1" /> 시트 고정됨
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={targetColorCode}
                onChange={(e) => setTargetColorCode(e.target.value)}
                placeholder="코드 입력"
                className="bg-white border border-slate-300 px-3 py-2 rounded-md text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 flex-1 uppercase shadow-inner"
              />
              <button
                onClick={handleConfirmBase}
                disabled={isBaseConfirmed}
                className={`px-3 py-2 rounded-md text-sm font-bold flex items-center shadow-md ${
                  isBaseConfirmed
                    ? "bg-slate-200 text-slate-400"
                    : "bg-slate-800 text-white"
                }`}
              >
                {isBaseConfirmed ? (
                  <Lock size={14} className="mr-1" />
                ) : (
                  <Unlock size={14} className="mr-1" />
                )}
                <span>확정</span>
              </button>
              <button
                onClick={handleClearAll}
                className="bg-white text-red-600 border border-red-200 px-3 py-2 rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-3 pb-6">
              <div className="text-sm font-black text-slate-500 mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
                <span>▼ 베이스 코트</span>
                <label className="flex items-center bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  <span className="mr-2 text-xs font-bold text-purple-700">
                    3Coat 펄 모드
                  </span>
                  <input
                    type="checkbox"
                    checked={isThreeCoatMode}
                    onChange={() => setIsThreeCoatMode(!isThreeCoatMode)}
                    className="w-4 h-4 rounded text-purple-600"
                  />
                </label>
              </div>

              {toners.map((toner) => (
                <div
                  key={toner.id}
                  className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-md border border-slate-200"
                >
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={toner.code}
                      onChange={(e) =>
                        handleCodeChange(toner.id, e.target.value, false)
                      }
                      placeholder="Code"
                      className="w-full bg-white text-[14px] font-black px-2 py-1.5 border border-slate-300 rounded uppercase"
                    />
                  </div>
                  <div className="col-span-4 flex flex-col">
                    <div className="text-[13px] font-bold text-blue-700 truncate">
                      {toner.role}
                    </div>
                  </div>
                  <div className="col-span-4 flex justify-end items-center space-x-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={toner.adjustedWeight}
                      onChange={(e) =>
                        handleWeightInputChange(toner.id, e.target.value, false)
                      }
                      placeholder="0"
                      className="border border-slate-300 font-bold px-2 py-1.5 rounded-md text-[14px] w-14 text-right"
                    />
                    <span className="text-slate-500 text-xs">g</span>
                    <button
                      onClick={() => removeToner(toner.id, false)}
                      className="text-slate-300 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addToner(false)}
                className="w-full py-2.5 border border-dashed border-slate-300 bg-slate-50 rounded-md text-slate-500 font-bold text-sm mt-2"
              >
                <Plus size={16} className="inline mr-1" />
                베이스 추가
              </button>
            </div>

            {isThreeCoatMode && (
              <div className="pt-4 border-t-2 border-dashed border-purple-200 space-y-3 pb-8">
                <div className="text-sm font-black text-purple-700 mb-2">
                  ▼ 펄 코트
                </div>
                {pearlToners.map((toner) => (
                  <div
                    key={toner.id}
                    className="grid grid-cols-12 gap-2 items-center bg-purple-50/40 p-2 rounded-md border border-purple-100"
                  >
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={toner.code}
                        onChange={(e) =>
                          handleCodeChange(toner.id, e.target.value, true)
                        }
                        placeholder="Code"
                        className="w-full bg-white text-[14px] font-black px-2 py-1.5 border border-purple-200 rounded uppercase"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="text-[13px] font-bold text-purple-700 truncate">
                        {toner.role}
                      </div>
                    </div>
                    <div className="col-span-4 flex justify-end items-center space-x-1">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={toner.adjustedWeight}
                        onChange={(e) =>
                          handleWeightInputChange(
                            toner.id,
                            e.target.value,
                            true
                          )
                        }
                        placeholder="0"
                        className="border border-purple-200 font-bold px-2 py-1.5 rounded-md text-[14px] w-14 text-right"
                      />
                      <span className="text-slate-500 text-xs">g</span>
                      <button
                        onClick={() => removeToner(toner.id, true)}
                        className="text-slate-300 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addToner(true)}
                  className="w-full py-2.5 border border-dashed border-purple-300 bg-purple-50 rounded-md text-purple-600 font-bold text-sm mt-2"
                >
                  <Plus size={16} className="inline mr-1" />펄 추가
                </button>
              </div>
            )}
          </div>
          <div className="p-3 bg-slate-800 text-slate-100 flex justify-between items-center shrink-0">
            <div className="text-xs font-bold">Total Weight</div>
            <div className="text-lg font-black">{totalFinalWeight} g</div>
          </div>
        </div>

        {/* 우측: 렌더링 & AI 터미널 */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xl">
            <h3 className="text-[15px] font-bold mb-3 flex items-center border-b border-slate-100 pb-2">
              <Layers className="text-blue-600 mr-2" size={18} />
              렌더링 비교
            </h3>
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col space-y-1">
                <span className="text-[11px] font-black text-slate-500">
                  A. 베이스 코트
                </span>
                <div
                  className="h-12 rounded-lg border border-slate-300"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${getColorString(
                      baseOptics,
                      "face"
                    )} 0%, ${getColorString(
                      baseOptics,
                      "mid"
                    )} 45%, ${getColorString(baseOptics, "flop")} 100%)`,
                  }}
                ></div>
              </div>
              {isThreeCoatMode && (
                <div className="flex flex-col space-y-1">
                  <span className="text-[11px] font-black text-purple-600">
                    B. 펄 코트
                  </span>
                  <div
                    className="h-12 rounded-lg border border-purple-300"
                    style={{
                      background: isBaseConfirmed
                        ? `radial-gradient(circle at 35% 35%, ${getColorString(
                            pearlOptics,
                            "face"
                          )} 0%, ${getColorString(
                            pearlOptics,
                            "mid"
                          )} 45%, ${getColorString(pearlOptics, "flop")} 100%)`
                        : "#f1f5f9",
                    }}
                  ></div>
                </div>
              )}
              <div className="flex flex-col space-y-1">
                <span className="text-[11px] font-black text-blue-600">
                  {isThreeCoatMode ? "C. 최종 결합" : "B. 최종 렌더링"}
                </span>
                <div
                  className="h-16 rounded-lg border border-blue-400"
                  style={{
                    background: isBaseConfirmed
                      ? `radial-gradient(circle at 35% 35%, ${getColorString(
                          finalOptics,
                          "face"
                        )} 0%, ${getColorString(
                          finalOptics,
                          "mid"
                        )} 45%, ${getColorString(finalOptics, "flop")} 100%)`
                      : "#f1f5f9",
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-4 flex flex-col shadow-xl h-[400px]">
            <h3 className="text-[14px] font-bold flex items-center mb-3 text-slate-800">
              <BrainCircuit className="text-blue-600 mr-2" size={18} />
              AI 엔진 터미널
            </h3>
            <div
              ref={chatContainerRef}
              className="flex-1 bg-slate-50 border border-slate-200 p-3 overflow-y-auto mb-3 space-y-3 rounded-lg text-sm"
            >
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg border ${
                    msg.type === "system"
                      ? "bg-slate-800 text-slate-100"
                      : msg.type === "user"
                      ? "bg-blue-600 text-white ml-6"
                      : "bg-white border-slate-200 mr-6"
                  }`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: msg.text
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          '<span class="font-extrabold">$1</span>'
                        )
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                </div>
              ))}
              {isAiProcessing && (
                <div className="text-slate-500 animate-pulse text-sm">
                  분석 중...
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskSolution()}
                placeholder="음성 명령 또는 타이핑"
                className="w-full bg-white border border-slate-300 rounded-md pl-3 py-2 text-sm"
              />
              <button
                onClick={handleAskSolution}
                className="bg-blue-600 text-white px-4 rounded-md font-bold"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🎙️ 아이폰 엄지손가락용 플로팅 마이크 버튼 */}
      <button
        onClick={handleVoiceCommand}
        className={`fixed bottom-8 right-6 w-16 h-16 rounded-full shadow-2xl text-white flex items-center justify-center z-50 transition-all ${
          isListening
            ? "bg-red-500 animate-bounce scale-110 shadow-red-500/50"
            : "bg-blue-600 hover:bg-blue-700 shadow-blue-900/50"
        }`}
      >
        <Mic size={32} />
      </button>
    </div>
  );
}
