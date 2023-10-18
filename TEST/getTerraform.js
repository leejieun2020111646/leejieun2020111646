const XLSX = require('xlsx'); // xlsx 라이브러리 사용
const fs = require('fs'); // 파일 시스템 모듈 사용

// Excel 파일에서 테라폼 코드 추출
function extractCodeFromExcel(excelFilePath) {
  const workbook = XLSX.readFile(excelFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  //파일 유형 데이터
  const codeData = {
    'provider': [],
    'variables': [],
    'vpc': [],
    'resources': []
  };

  for (let row = 2; ; row++) {
    const codeCell = worksheet[`E${row}`];
    const aCellValue = worksheet[`A${row}`];

    if (!codeCell || !aCellValue) {
      break;
    }

    const category = aCellValue.v.toLowerCase(); // A열 값을 소문자로 변환

    // A열 값에 따라 데이터를 해당 배열에 저장 -> 파일별로 값 저장하도록 함
    if (codeData[category]) {
        codeData[category].push(codeCell.v);
      }
    }

  return codeData;
}

// Excel 파일 경로
const excelFilePath = 'C:/Users/jieun/OneDrive/바탕 화면/TEST/Terraform_VPC_code.xlsx';

// Output 파일 경로
const outputDirectory = 'C:/Users/jieun/OneDrive/바탕 화면/TEST/';

// 코드를 추출
const codeData = extractCodeFromExcel(excelFilePath);

for (const category in codeData) {
  const fileName = `${category}.tf`; //Terraform 파일 형식으로 반환
  const content = codeData[category].join('\n');
  fs.writeFileSync(outputDirectory + fileName, content, 'utf-8');
  console.log(`${fileName} 파일에 데이터가 저장되었습니다.`); //저장 완료 시 로그 출력
}
