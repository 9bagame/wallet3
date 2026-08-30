// ═══════════════════════════════════════════════════
// Wallet2 — Multi-User & Multi-Wallet Tracker
// v2.2 — i18n (Thai/English) support
// ═══════════════════════════════════════════════════

let users = JSON.parse(localStorage.getItem('multi_users')) || null;
let transactions = JSON.parse(localStorage.getItem('multi_txs')) || null;
let forecasts = JSON.parse(localStorage.getItem('multi_forecasts')) || null;
let notificationTimes = JSON.parse(localStorage.getItem('multi_notif_times')) || [];
let userIdToDelete = null;
let lastTxType = localStorage.getItem('wallet2_last_tx_type') || 'expense';
let currentPage = 'home';
let historyPage = 1;
const HISTORY_PER_PAGE = 20;
let filteredHistory = [];

// ═══════════════════════════════════════════════════
// 🌐 i18n — TRANSLATIONS
// ═══════════════════════════════════════════════════

const translations = {
    th: {
        pageTitle: 'ตัวติดตามกระเป๋าเงินหลายคน',
        homeTitle: 'ระบบกระเป๋าเงินแยกบุคคล',
        homeSubtitle: 'จัดการสมาชิก และแยกกระเป๋าเงินสด/ธนาคาร ของแต่ละบุคคล',
        totalBalance: 'รวมยอดเงินทุกกระเป๋า',
        addNewPerson: '👤 เพิ่มบุคคลใหม่',
        personNamePlaceholder: 'ชื่อบุคคล (เช่น สมชาย, คุณแม่)',
        initialCashPlaceholder: 'เงินสดตั้งต้น',
        initialBankPlaceholder: 'ธนาคารตั้งต้น',
        addPersonBtn: 'เพิ่มรายชื่อพร้อมกระเป๋าเงิน',
        peopleWallets: '👥 รายชื่อและกระเป๋าเงิน',
        incomeExpenseTab: 'รายรับ / รายจ่าย',
        transferTab: 'โอนเงินข้ามกระเป๋า',
        selectPersonWallet: 'เลือกบุคคล/กระเป๋า',
        transactionType: 'ประเภทรายการ',
        incomeOption: '🟢 รายรับ',
        expenseOption: '🔴 รายจ่าย',
        amountLabel: 'จำนวนเงิน (บาท)',
        noteLabel: 'บันทึกความจำ',
        notePlaceholder: 'เช่น ค่าอาหารกลางวัน, เงินเดือน',
        saveTransactionBtn: 'บันทึกรายการ',
        fromWallet: 'จากกระเป๋าต้นทาง',
        toWallet: 'ไปยังกระเป๋าปลายทาง',
        transferAmount: 'จำนวนเงินที่ต้องการโอน (บาท)',
        confirmTransferBtn: 'ยืนยันการโอนเงิน',
        allHistory: '📜 ประวัติธุรกรรมทั้งหมด',
        exportCsv: '📥 Export CSV',
        searchTxPlaceholder: '🔍 ค้นหาชื่อรายการ...',
        allTypes: 'ทุกประเภท',
        incomeFilter: '💰 รายรับ',
        expenseFilter: '💸 รายจ่าย',
        transferFilter: '🔄 โอนเงิน',
        dateTo: 'ถึง',
        thDateTime: 'วัน-เวลา',
        thDetails: 'รายละเอียด',
        thType: 'ประเภท',
        thNote: 'บันทึก',
        thAmount: 'จำนวนเงิน',
        prevPage: '‹ ก่อนหน้า',
        nextPage: 'ถัดไป ›',
        monthlySummary: '📊 สรุปรายเดือน',
        totalIncomeMonth: 'รวมรับ / เดือน',
        fixedVariable: 'คงที่ / ผันแปร',
        netLiquidity: 'สภาพคล่องสุทธิ',
        expenseForecast: '💸 ตั้งค่า คาดการณ์รายจ่าย',
        addExpensePlan: '+ เพิ่มแผนจ่าย',
        thItem: 'รายการ',
        thType2: 'ประเภท',
        thAmountMonth: 'ยอด/เดือน',
        thManage: 'จัดการ',
        noForecastItems: 'ยังไม่มีรายการคาดการณ์',
        incomeForecast: '💰 ตั้งค่า คาดการณ์รายรับ',
        addIncomePlan: '+ เพิ่มแผนรับ',
        thItem2: 'รายการ',
        thIncomeAmount: 'ยอดรับ',
        thManage2: 'จัดการ',
        noForecastItems2: 'ยังไม่มีรายการคาดการณ์',
        liquidityChart: '📈 แผนภูมิสภาพคล่อง',
        selectLanguage: 'เลือกภาษา',
        notifSettings: '🔔 ตั้งค่าการแจ้งเตือน',
        notifPermission: 'สิทธิ์การแจ้งเตือน',
        notifChecking: 'กำลังตรวจสอบ...',
        enableNotif: '🔔 เปิดสิทธิ์แจ้งเตือน',
        notifTimes: 'ช่วงเวลาแจ้งเตือน',
        addTime: '+ เพิ่มเวลา',
        testNotif: '🧪 ทดสอบแจ้งเตือนทันที',
        dataManagement: '💾 จัดการข้อมูล',
        loadSample: '🎲 โหลดข้อมูลจำลอง',
        sampleDataLoaded: '🎲 โหลดข้อมูลจำลองสำเร็จ',
        exportAll: '📤 ส่งออกข้อมูลทั้งหมด (JSON)',
        importAll: '📥 นำเข้าข้อมูล (JSON)',
        clearHistory: '🗑️ ล้างประวัติธุรกรรม',
        resetAll: '⚠️ รีเซ็ตข้อมูลทั้งหมด',
        aboutTitle: 'ตัวติดตามกระเป๋าเงินหลายคน',
        aboutVersion: 'เวอร์ชัน 2.0 — ระบบกระเป๋าเงินแยกบุคคล',
        aboutStorage: 'ข้อมูลถูกเก็บใน LocalStorage ของเบราว์เซอร์',
        navHome: 'หน้าแรก',
        navHistory: 'ประวัติ',
        navLiquidity: 'สภาพคล่อง',
        navSettings: 'ตั้งค่า',
        analyticsTitle: '📊 รายละเอียด & สถิติภาพรวม',
        personLabel: 'บุคคล:',
        todayMaxIncome: '📈 รายรับสูงสุดวันนี้',
        todayTotalIncome: '💰 รวมรายรับวันนี้',
        todayMaxExpense: '📉 รายจ่ายสูงสุดวันนี้',
        todayTotalExpense: '💸 รวมรายจ่ายวันนี้',
        avgDailyIncome: '📅 ค่าเฉลี่ยรายรับต่อวัน',
        last7Days: '7 วันล่าสุด:',
        last30Days: '30 วันล่าสุด:',
        avgDailyExpense: '📅 ค่าเฉลี่ยรายจ่ายต่อวัน',
        last7Days2: '7 วันล่าสุด:',
        last30Days2: '30 วันล่าสุด:',
        dailySummary: '📋 สรุปยอดรวม รายรับ-รายจ่าย ประจำวัน',
        thDate: 'วันที่',
        thTotalIncome: 'รวมรายรับ',
        thTotalExpense: 'รวมรายจ่าย',
        thNet: 'สุทธิ',
        closeDetails: '❌ ปิดหน้าต่างรายละเอียด',
        removePerson: 'ลบบุคคลออกจากระบบ',
        removePersonDesc: 'ยอดคงเหลือทั้งหมดของคนนี้จะหายไปทันทีและไม่สามารถกู้คืนได้',
        cancelBtn: 'ยกเลิก',
        holdConfirm: 'กดค้าง 3 วิ เพื่อยืนยัน',
        editData: 'แก้ไขข้อมูล',
        fillInfo: 'กรุณากรอกข้อมูลด้านล่าง',
        cancelBtn2: 'ยกเลิก',
        saveBtn: 'บันทึก',
        confirmTx: '💡 ยืนยันรายการ',
        notifDetails: 'รายละเอียดข้อความแจ้งเตือน',
        rejectBtn: 'ปฏิเสธ',
        okBtn: 'ตกลง',
        addForecastPlan: 'เพิ่มแผนคาดการณ์',
        itemName: 'ชื่อรายการ *',
        itemNamePlaceholder: 'เช่น ค่าเช่าบ้าน',
        category: 'หมวดหมู่',
        fixedCost: 'Fixed Cost (ผูกพัน/จำเป็น)',
        variableCost: 'Variable Cost (ผันแปร)',
        amountMonth: 'จำนวนเงิน/เดือน *',
        dueDate: 'วันที่ชำระ',
        every1st: 'ทุกวันที่ 1',
        every5th: 'ทุกวันที่ 5',
        every10th: 'ทุกวันที่ 10',
        every15th: 'ทุกวันที่ 15',
        every20th: 'ทุกวันที่ 20',
        every25th: 'ทุกวันที่ 25',
        endOfMonth: 'ทุกวันที่สิ้นเดือน',
        customOption: 'กำหนดเอง...',
        customSchedulePlaceholder: 'เช่น ทุกวันจันทร์, ทุกวันที่ 7',
        cancelBtn3: 'ยกเลิก',
        savePlanBtn: 'บันทึกแผน',
        clearHistoryTitle: 'ล้างประวัติธุรกรรม',
        clearHistoryDesc: 'ประวัติจะถูกลบ แต่ยอดเงินคงเหลือจะไม่เปลี่ยนแปลง',
        cancelBtn4: 'ยกเลิก',
        holdConfirm2: 'กดค้าง 3 วิ เพื่อยืนยัน',
        resetAllTitle: 'รีเซ็ตข้อมูลทั้งหมด',
        resetAllDesc: 'ข้อมูลทั้งหมดจะถูกลบและเริ่มต้นใหม่จากค่าเริ่มต้น',
        cancelBtn5: 'ยกเลิก',
        holdConfirm3: 'กดค้าง 3 วิ เพื่อยืนยัน',
        // Dynamic content
        labelCash: '💵 เงินสด',
        labelBank: '🏦 ธนาคาร',
        labelTotal: '💰 ยอดรวม:',
        btnViewStats: '📊 ดูสถิติรายละเอียด',
        txtCash: '💵 เงินสด',
        txtBank: '🏦 ธนาคาร',
        btnEditName: '✏️ แก้ไขชื่อ',
        descEnterNewName: 'กรุณาใส่ชื่อใหม่',
        txtNameUpdated: '✅ อัพเดทชื่อสำเร็จ',
        badgeIncome: '💰 รายรับ',
        badgeExpense: '💸 รายจ่าย',
        badgeTransfer: '🔄 โอนเงิน',
        summaryIncome: '💰 รายรับ: ',
        summaryExpense: '💸 รายจ่าย: ',
        summaryTx: ' transactions',
        noTxFound: 'ไม่พบรายการ',
        noDataAvailable: 'ไม่มีข้อมูล',
        chartLabelIncome: 'รายรับ',
        chartLabelExpense: 'รายจ่าย',
        fixedLabel: 'คงที่',
        variableLabel: 'ผันแปร',
        modalExpenseForecast: '💸 เพิ่มแผนคาดการณ์รายจ่าย',
        modalIncomeForecast: '💰 เพิ่มแผนคาดการณ์รายรับ',
        txIncomeLabel: 'Income',
        txExpenseLabel: 'Expense',
        txTransferLabel: 'Transfer',
        notifStatusNotSupported: '❌ ไม่รองรับ',
        notifStatusEnabled: '✅ เปิดใช้งานแล้ว',
        notifStatusBlocked: '🚫 ถูกบล็อก',
        notifStatusPending: '⏳ ยังไม่ได้ตัดสินใจ',
        notifNotSupported: '❌ การแจ้งเตือนไม่รองรับบนอุปกรณ์นี้',
        notifEnabled: '🔔 เปิดการแจ้งเตือนสำเร็จ',
        notifNotEnabled: '⚠️ ไม่สามารถเปิดการแจ้งเตือนได้',
        notifPrompt: 'กรุณากรอกเวลาแจ้งเตือน (เช่น 08:00, 12:30):',
        notifTimeAdded: '🔔 เพิ่มเวลาแจ้งเตือน ',
        notifTimeAdded2: ' สำเร็จ',
        notifTimeBadFormat: '⚠️ รูปแบบเวลาไม่ถูกต้อง (ใช้ HH:MM)',
        notifTimeRemoved: '🗑️ ลบเวลาแจ้งเตือนแล้ว',
        notifTestPleaseEnable: '⚠️ กรุณาเปิดการแจ้งเตือนก่อน',
        notifTestTitle: '💰 Wallet2 การแจ้งเตือนทดสอบ',
        notifTestBody: 'การแจ้งเตือนทดสอบสำเร็จ!',
        notifTestSent: '🧪 ส่งการแจ้งเตือนทดสอบสำเร็จ',
        noTxToExport: '⚠️ ไม่มีรายการให้ส่งออก',
        csvExported: '📥 Export CSV สำเร็จ',
        dataExported: '📤 ส่งออกข้อมูลสำเร็จ',
        dataImported: '📥 Import ข้อมูลสำเร็จ!',
        dataImportFail: '❌ ไม่สามารถอ่านไฟล์ได้',
        txCleared: '🗑️ ล้างข้อมูลสำเร็จ',
        dataReset: '⚠️ รีเซ็ตข้อมูลสำเร็จ โหลดข้อมูลจำลองแล้ว',
        txDeleted: '🗑️ ลบรายการสำเร็จ',
        txDeletedConfirm: '🔄 ยืนยันการลบรายการ',
        txDeleteDesc1: 'ลบรายการ "" จำนวน ',
        txDeleteDesc2: ' บาท ต้องการลบจริงหรือไม่?',
        txDeletedSuccess: '✅ ลบรายการสำเร็จ',
        nameUpdated: '✏️ อัพเดทชื่อสำเร็จ',
        personAdded: '👤 เพิ่มบุคคลสำเร็จ',
        fillAllInfo: '⚠️ กรุณากรอกข้อมูลให้ครบถ้วน',
        txRecorded: '🟢 บันทึกรายการสำเร็จ',
        noPerson: '❌ ไม่พบบุคคล',
        insufficientFunds: '⚠️ ยอดเงินไม่พอ',
        insufficientFundsDesc: 'เงินคงเหลือไม่พอที่จะทำรายการจ่าย ยอดเงินจะติดลบ ต้องการดำเนินการต่อหรือไม่?',
        fillTransferInfo: '⚠️ กรุณากรอกข้อมูลการโอนให้ครบถ้วน',
        sameWallet: '❌ ไม่สามารถโอนเข้ากระเป๋าเดียวกัน',
        noPersonFound: '❌ ไม่พบบุคคล',
        balanceNotEnough: '❌ เงินคงเหลือไม่พอ ',
        transferDone: '✔ การโอนสำเร็จ!',
        transferNote: 'โอนเงินข้ามกระเป๋า',
        walletLabelCash: '💵 เงินสด',
        walletLabelBank: '🏦 ธนาคาร',
        scheduleEvery1st: 'ทุกวันที่ 1',
        sampleUsers: ['สมชาย', 'สุEarng', 'คุณแม่'],
        sampleUserNames: {1: 'สมชาย', 2: 'สุEarng', 3: 'คุณแม่'},
        sampleExpenseTitles: ['☕ ค่ากาแฟ', '🍜 ข้าวมันไก่', '🛒 ซื้อของซูเปอร์', '⛽ เติมน้ำมัน', '📱 เติมเงินมือถือ', '🎬 ดูหนัง', '💊 ยา', '🚕 แท็กซี่/แกร็บ', '🏎️ ซ่อมรถ', '🍜 พิซซ่าฮัท', '🍱 ข้าวกลางวัน 7-Eleven', '🍰 ของหวาน'],
        sampleIncomeTitles: ['💰 รับเงินเดือน', '📦 รายได้เสริม', '💵 เงินคืน', '🎁 เงินขวัญ', '📈 ปันผลการลงทุน', '🏠 ค่าเช่าบ้าน'],
        sampleTxNames: {someUser: 'someone'},
        sampleTxNamesWallet: ['Cash', 'Bank'],
        sampleTransferNote: 'โอนเงินข้ามกระเป๋า',
    },
    en: {
        pageTitle: 'Multi-User Wallet Tracker',
        homeTitle: 'Personal Wallet System',
        homeSubtitle: 'Manage members and separate cash/bank wallets per person',
        totalBalance: 'Total balance across all wallets',
        addNewPerson: '👤 Add New Person',
        personNamePlaceholder: 'Person name (e.g., John, Mom)',
        initialCashPlaceholder: 'Initial cash',
        initialBankPlaceholder: 'Initial bank',
        addPersonBtn: 'Add Person with Wallet',
        peopleWallets: '👥 People & Wallets',
        incomeExpenseTab: 'Income / Expense',
        transferTab: 'Transfer Between Wallets',
        selectPersonWallet: 'Select Person/Wallet',
        transactionType: 'Transaction Type',
        incomeOption: '🟢 Income',
        expenseOption: '🔴 Expense',
        amountLabel: 'Amount (THB)',
        noteLabel: 'Note',
        notePlaceholder: 'e.g., Lunch, Salary',
        saveTransactionBtn: 'Save Transaction',
        fromWallet: 'From Source Wallet',
        toWallet: 'To Destination Wallet',
        transferAmount: 'Transfer Amount (THB)',
        confirmTransferBtn: 'Confirm Transfer',
        allHistory: '📜 All Transaction History',
        exportCsv: '📥 Export CSV',
        searchTxPlaceholder: '🔍 Search transaction name...',
        allTypes: 'All Types',
        incomeFilter: '💰 Income',
        expenseFilter: '💸 Expense',
        transferFilter: '🔄 Transfer',
        dateTo: 'to',
        thDateTime: 'Date-Time',
        thDetails: 'Details',
        thType: 'Type',
        thNote: 'Note',
        thAmount: 'Amount',
        prevPage: '‹ Previous',
        nextPage: 'Next ›',
        monthlySummary: '📊 Monthly Summary',
        totalIncomeMonth: 'Total Income / Month',
        fixedVariable: 'Fixed / Variable',
        netLiquidity: 'Net Liquidity',
        expenseForecast: '💸 Expense Forecast Settings',
        addExpensePlan: '+ Add Expense Plan',
        thItem: 'Item',
        thType2: 'Type',
        thAmountMonth: 'Amount/Month',
        thManage: 'Manage',
        noForecastItems: 'No forecast items yet',
        incomeForecast: '💰 Income Forecast Settings',
        addIncomePlan: '+ Add Income Plan',
        thItem2: 'Item',
        thIncomeAmount: 'Income Amount',
        thManage2: 'Manage',
        noForecastItems2: 'No forecast items yet',
        liquidityChart: '📈 Liquidity Chart',
        selectLanguage: 'Select Language',
        notifSettings: '🔔 Notification Settings',
        notifPermission: 'Notification Permission',
        notifChecking: 'Checking...',
        enableNotif: '🔔 Enable Notifications',
        notifTimes: 'Notification Times',
        addTime: '+ Add Time',
        testNotif: '🧪 Test Notification Now',
        dataManagement: '💾 Data Management',
        loadSample: '🎲 Load Sample Data',
        sampleDataLoaded: '🎲 Sample data loaded successfully',
        exportAll: '📤 Export All Data (JSON)',
        importAll: '📥 Import Data (JSON)',
        clearHistory: '🗑️ Clear Transaction History',
        resetAll: '⚠️ Reset All Data',
        aboutTitle: 'Multi-User Wallet Tracker',
        aboutVersion: 'Version 2.0 — Personal Wallet System',
        aboutStorage: 'Data is stored in browser\'s LocalStorage',
        navHome: 'Home',
        navHistory: 'History',
        navLiquidity: 'Liquidity',
        navSettings: 'Settings',
        analyticsTitle: '📊 Details & Overview Statistics',
        personLabel: 'Person:',
        todayMaxIncome: '📈 Today\'s Max Income',
        todayTotalIncome: '💰 Today\'s Total Income',
        todayMaxExpense: '📉 Today\'s Max Expense',
        todayTotalExpense: '💸 Today\'s Total Expense',
        avgDailyIncome: '📅 Average Daily Income',
        last7Days: 'Last 7 days:',
        last30Days: 'Last 30 days:',
        avgDailyExpense: '📅 Average Daily Expense',
        last7Days2: 'Last 7 days:',
        last30Days2: 'Last 30 days:',
        dailySummary: '📋 Daily Income-Expense Summary',
        thDate: 'Date',
        thTotalIncome: 'Total Income',
        thTotalExpense: 'Total Expense',
        thNet: 'Net',
        closeDetails: '❌ Close Details Window',
        removePerson: 'Remove person from system',
        removePersonDesc: 'This person\'s total balance will be permanently deleted and cannot be recovered',
        cancelBtn: 'Cancel',
        holdConfirm: 'Hold 3 seconds to confirm',
        editData: 'Edit Data',
        fillInfo: 'Please fill in the information below',
        cancelBtn2: 'Cancel',
        saveBtn: 'Save',
        confirmTx: '💡 Confirm Transaction',
        notifDetails: 'Notification details',
        rejectBtn: 'Cancel',
        okBtn: 'OK',
        addForecastPlan: 'Add Forecast Plan',
        itemName: 'Item Name *',
        itemNamePlaceholder: 'e.g., House rent',
        category: 'Category',
        fixedCost: 'Fixed Cost (Recurring/Essential)',
        variableCost: 'Variable Cost (Variable)',
        amountMonth: 'Amount/Month *',
        dueDate: 'Due Date',
        every1st: 'Every 1st',
        every5th: 'Every 5th',
        every10th: 'Every 10th',
        every15th: 'Every 15th',
        every20th: 'Every 20th',
        every25th: 'Every 25th',
        endOfMonth: 'End of month',
        customOption: 'Custom...',
        customSchedulePlaceholder: 'e.g., Every Monday, Every 7th',
        cancelBtn3: 'Cancel',
        savePlanBtn: 'Save Plan',
        clearHistoryTitle: 'Clear Transaction History',
        clearHistoryDesc: 'History will be deleted but balances will not change',
        cancelBtn4: 'Cancel',
        holdConfirm2: 'Hold 3 seconds to confirm',
        resetAllTitle: 'Reset All Data',
        resetAllDesc: 'All data will be deleted and reset to defaults',
        cancelBtn5: 'Cancel',
        holdConfirm3: 'Hold 3 seconds to confirm',
        // Dynamic content
        labelCash: '💵 Cash',
        labelBank: '🏦 Bank',
        labelTotal: '💰 Total:',
        btnViewStats: '📊 View Statistics & Details',
        txtCash: '💵 Cash',
        txtBank: '🏦 Bank',
        btnEditName: '✏️ Edit Name',
        descEnterNewName: 'Please enter the new name',
        txtNameUpdated: '✅ Name updated successfully',
        badgeIncome: '💰 Income',
        badgeExpense: '💸 Expense',
        badgeTransfer: '🔄 Transfer',
        summaryIncome: '💰 Income: ',
        summaryExpense: '💸 Expense: ',
        summaryTx: ' transactions',
        noTxFound: 'No transactions found',
        noDataAvailable: 'No Data Available',
        chartLabelIncome: 'Income',
        chartLabelExpense: 'Expense',
        fixedLabel: 'Fixed',
        variableLabel: 'Variable',
        modalExpenseForecast: '💸 Add Expense Forecast',
        modalIncomeForecast: '💰 Add Income Forecast',
        txIncomeLabel: 'Income',
        txExpenseLabel: 'Expense',
        txTransferLabel: 'Transfer',
        notifStatusNotSupported: '❌ Not supported',
        notifStatusEnabled: '✅ Enabled',
        notifStatusBlocked: '🚫 Blocked',
        notifStatusPending: '⏳ Not yet decided',
        notifNotSupported: '❌ Notifications not supported on this device',
        notifEnabled: '🔔 Notifications enabled successfully',
        notifNotEnabled: '⚠️ Could not enable notifications',
        notifPrompt: 'Enter notification time (e.g., 08:00, 12:30):',
        notifTimeAdded: '🔔 Notification time ',
        notifTimeAdded2: ' added successfully',
        notifTimeBadFormat: '⚠️ Time format is incorrect (use HH:MM)',
        notifTimeRemoved: '🗑️ Notification time removed',
        notifTestPleaseEnable: '⚠️ Please enable notifications first',
        notifTestTitle: '💰 Wallet2 Test Notification',
        notifTestBody: 'Notification test is working!',
        notifTestSent: '🧪 Test notification sent successfully',
        noTxToExport: '⚠️ No transactions to export',
        csvExported: '📥 CSV export successful',
        dataExported: '📤 Data export completed successfully',
        dataImported: '📥 Data import completed successfully!',
        dataImportFail: '❌ File could not be read',
        txCleared: '🗑️ Transaction data cleared successfully',
        dataReset: '⚠️ Data reset completed successfully. Sample data has been loaded.',
        txDeleted: '🗑️ Transaction deleted successfully',
        txDeletedConfirm: '🔄 Confirm Transaction Deletion',
        txDeleteDesc1: 'Delete transaction "" with amount ',
        txDeleteDesc2: ' THB. Are you sure?',
        txDeletedSuccess: '✅ Transaction deleted successfully',
        nameUpdated: '✏️ Name updated successfully',
        personAdded: '👤 Person added successfully',
        fillAllInfo: '⚠️ Please fill in all information',
        txRecorded: '🟢 Transaction recorded successfully',
        noPerson: '❌ Person not found',
        insufficientFunds: '⚠️ Insufficient funds',
        insufficientFundsDesc: 'Balance is not enough to complete this expense. The balance will go negative. Proceed anyway?',
        fillTransferInfo: '⚠️ Please fill in all transfer information',
        sameWallet: '❌ Cannot transfer to the same wallet',
        noPersonFound: '❌ Person not found',
        balanceNotEnough: '❌ Balance is not enough for ',
        transferDone: '✔ Transfer completed successfully!',
        transferNote: 'Transfer between wallets',
        walletLabelCash: '💵 Cash',
        walletLabelBank: '🏦 Bank',
        scheduleEvery1st: 'Every 1st',
        sampleUsers: ['Somchai', 'Saeng', 'Mom'],
        sampleUserNames: {1: 'Somchai', 2: 'Saeng', 3: 'Mom'},
        sampleExpenseTitles: ['☕ Coffee', '🍜 Japanese Food', '🛒 Supermarket Shopping', '⛽ Gas Station', '📱 Top-Up Phone', '🎬 Movie', '💊 Medicine', '🚕 Taxi / Grab', '🏎️ Car Maintenance', '🍜 Pizza Hut', '🍱 Lunch at 7-Eleven', '🍰 Dessert'],
        sampleIncomeTitles: ['💰 Receive Salary', '📦 Freelance Income', '💵 Cash Return', '🎁 Gift Money', '📈 Investment Dividend', '🏠 House Rental Income'],
        sampleTxNames: {someUser: 'Someone'},
        sampleTxNamesWallet: ['Cash', 'Bank'],
        sampleTransferNote: 'Transfer between wallets',
    }
};

let currentLang = localStorage.getItem('wallet2_lang') || 'th';

function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || (translations.en && translations.en[key]) || key;
}

function applyTranslations() {
    // Update page title
    document.title = t('pageTitle');

    // Update textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key && translations[currentLang] && translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key && translations[currentLang] && translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });
}

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('wallet2_lang', lang);
    applyTranslations();
    // Re-render dynamic content
    renderUsers();
    renderDropdowns();
    calculateTotal();
    if (currentPage === 'history') {
        renderHistoryPage();
        renderHistorySummary();
        renderHistoryChart();
    }
    if (currentPage === 'liquidity') {
        updateLiquidity();
    }
}

// ═══════════════════════════════════════════════════
// 🛡️ XSS PROTECTION — Escape HTML special chars
// ═══════════════════════════════════════════════════

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ═══════════════════════════════════════════════════
// ⏱️ HOLD BUTTON — Hold 3 seconds to confirm
// ═══════════════════════════════════════════════════

function setupHoldButton(btnId, progressId, duration, onConfirm) {
    const btn = document.getElementById(btnId);
    const progress = document.getElementById(progressId);
    if (!btn || !progress) return;

    let interval = null;
    let elapsed = 0;

    function startHold() {
        elapsed = 0;
        progress.style.width = '0%';
        interval = setInterval(() => {
            elapsed += 50;
            const pct = Math.min((elapsed / duration) * 100, 100);
            progress.style.width = pct + '%';
            if (elapsed >= duration) {
                clearInterval(interval);
                interval = null;
                elapsed = 0;
                progress.style.width = '0%';
                onConfirm();
            }
        }, 50);
    }

    function stopHold() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
        elapsed = 0;
        progress.style.width = '0%';
    }

    // Mouse events
    btn.addEventListener('mousedown', startHold);
    btn.addEventListener('mouseup', stopHold);
    btn.addEventListener('mouseleave', stopHold);

    // Touch events (mobile)
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(); });
    btn.addEventListener('touchend', stopHold);
    btn.addEventListener('touchcancel', stopHold);
}

// ═══════════════════════════════════════════════════
// 📅 THAI DATE HELPERS
// ═══════════════════════════════════════════════════

function parseThaiDate(dateStr) {
    if (!dateStr) return null;
    try {
        const parts = dateStr.split(/[, ]+/);
        const dateParts = parts[0].split('/');
        if (dateParts.length < 3) return null;
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1;
        let year = parseInt(dateParts[2]);
        if (year > 2100) year -= 543;
        const timeParts = (parts[1] || '00:00').split(':');
        const hour = parseInt(timeParts[0]) || 0;
        const minute = parseInt(timeParts[1]) || 0;
        const d = new Date(year, month, day, hour, minute);
        return isNaN(d.getTime()) ? null : d;
    } catch (e) {
        return null;
    }
}

function parseInputDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length < 3) return null;
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

// ═══════════════════════════════════════════════════
// 📄 PAGE SWITCHING
// ═══════════════════════════════════════════════════

function switchPage(page, btnEl) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    currentPage = page;

    if (page === 'history') {
        applyHistoryFilter();
        renderHistoryChart();
    }
    if (page === 'liquidity') {
        updateLiquidity();
        renderLiquidityChart();
    }
    if (page === 'settings') {
        checkNotificationStatus();
        renderNotificationTimes();
    }
}

// ═══════════════════════════════════════════════════
// 💰 CORE UI UPDATE
// ═══════════════════════════════════════════════════

function updateUI() {
    localStorage.setItem('multi_users', JSON.stringify(users));
    localStorage.setItem('multi_txs', JSON.stringify(transactions));
    localStorage.setItem('multi_forecasts', JSON.stringify(forecasts));
    localStorage.setItem('multi_notif_times', JSON.stringify(notificationTimes));

    renderUsers();
    renderDropdowns();
    calculateTotal();
}

function calculateTotal() {
    const total = users.reduce((sum, user) => sum + user.cash + user.bank, 0);
    document.getElementById('total-all-wallets').innerText = `\u0E3F${total.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
    // Send balance to SW for background notifications
    syncSWBalance(total);
}

// ─── Sync notification data to Service Worker ───
function syncSWNotificationTimes() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'SET_NOTIFICATION_TIMES',
            times: notificationTimes
        });
    }
}

function syncSWBalance(total) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'SET_BALANCE',
            total: total
        });
    }
}

// ═══════════════════════════════════════════════════
// 👥 USERS RENDERING (XSS-Safe)
// ═══════════════════════════════════════════════════

function renderUsers() {
    const list = document.getElementById('users-list');
    if (!list) return;
    list.innerHTML = '';

    users.forEach(user => {
        const userTotal = user.cash + user.bank;
        const safeName = escapeHtml(user.name);
        const card = document.createElement('div');
        card.className = 'p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-2 relative group';
        card.innerHTML = `
            <div class="flex justify-between items-center border-b border-slate-800 pb-1">
                <div class="flex items-center gap-1.5">
                    <span class="font-semibold text-indigo-300 text-xs">\u{1F464} ${safeName}</span>
                    <button onclick="showInputModal('${escapeHtml(t('btnEditName'))}', '${escapeHtml(t('descEnterNewName'))}', '${escapeHtml(user.name).replace(/'/g, "\\'")}', (newName) => { user.name = newName; updateUI(); showToast('${escapeHtml(t('txtNameUpdated'))}'); })" class="text-slate-500 hover:text-indigo-400 text-[10px] transition">\u270F\uFE0F</button>
                </div>
                <button onclick="openDeleteUserModal(${user.id}, '${escapeHtml(user.name).replace(/'/g, "\\'")}')" class="text-slate-500 hover:text-rose-400 text-[10px] transition">\u274C</button>
            </div>
            <div class="grid grid-cols-2 gap-2 text-[10px]">
                <div class="bg-slate-800/50 p-2 rounded-lg">
                    <p class="text-slate-500">${t('labelCash')}</p>
                    <p class="font-bold text-slate-200">\u0E3F${user.cash.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</p>
                </div>
                <div class="bg-slate-800/50 p-2 rounded-lg">
                    <p class="text-slate-500">${t('labelBank')}</p>
                    <p class="font-bold text-slate-200">\u0E3F${user.bank.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</p>
                </div>
            </div>
            <div class="bg-indigo-950/40 p-2 rounded-lg flex justify-between items-center border border-indigo-900/30 text-[10px] mb-1">
                <span class="text-indigo-400 font-medium">${t('labelTotal')}</span>
                <span class="font-bold text-indigo-300">\u0E3F${userTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
            </div>
            <button onclick="openAnalyticsModal(${user.id}, '${escapeHtml(user.name).replace(/'/g, "\\'")}')" class="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-indigo-300 text-[10px] py-1.5 rounded-lg font-medium transition shadow-sm flex items-center justify-center gap-1">
                \u{1F4CA} ${t('btnViewStats')}
            </button>
        `;
        list.appendChild(card);
    });
}

// ═══════════════════════════════════════════════════
// 📋 DROPDOWNS
// ═══════════════════════════════════════════════════

function renderDropdowns() {
    const ieSelect = document.getElementById('ie-wallet-select');
    const tfFrom = document.getElementById('tf-from-select');
    const tfTo = document.getElementById('tf-to-select');
    if (!ieSelect) return;

    const prevIe = ieSelect.value;
    const prevFrom = tfFrom.value;
    const prevTo = tfTo.value;

    ieSelect.innerHTML = '';
    tfFrom.innerHTML = '';
    tfTo.innerHTML = '';

    // Bank first, then Cash
    users.forEach(user => {
        const safeName = escapeHtml(user.name);
        const bankOpt = `<option value="${user.id}-bank" class="bg-slate-900">${safeName} (${t('walletLabelBank')}: \u0E3F${user.bank})</option>`;
        const cashOpt = `<option value="${user.id}-cash" class="bg-slate-900">${safeName} (${t('walletLabelCash')}: \u0E3F${user.cash})</option>`;
        ieSelect.innerHTML += bankOpt + cashOpt;
        tfFrom.innerHTML += bankOpt + cashOpt;
        tfTo.innerHTML += bankOpt + cashOpt;
    });

    // Restore previous selection if still available
    if (prevIe && ieSelect.querySelector(`option[value="${prevIe}"]`)) ieSelect.value = prevIe;
    if (prevFrom && tfFrom.querySelector(`option[value="${prevFrom}"]`)) tfFrom.value = prevFrom;
    if (prevTo && tfTo.querySelector(`option[value="${prevTo}"]`)) tfTo.value = prevTo;
}

function applyHistoryFilter() {
    const search = (document.getElementById('history-search')?.value || '').toLowerCase();
    const typeFilter = document.getElementById('history-type-filter')?.value || 'all';
    const dateFrom = document.getElementById('history-date-from')?.value || '';
    const dateTo = document.getElementById('history-date-to')?.value || '';

    filteredHistory = transactions.filter(tx => {
        if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

        if (search) {
            const searchStr = `${tx.targetName || ''} ${tx.note || ''}`.toLowerCase();
            if (!searchStr.includes(search)) return false;
        }

        if (dateFrom || dateTo) {
            const txDate = parseThaiDate(tx.date);
            if (!txDate) return false;
            if (dateFrom) {
                const from = parseInputDate(dateFrom);
                if (from && txDate < from) return false;
            }
            if (dateTo) {
                const to = parseInputDate(dateTo);
                if (to && txDate > new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59)) return false;
            }
        }

        return true;
    });

    historyPage = 1;
    renderHistoryPage();
    renderHistorySummary();
}

function renderHistoryPage() {
    const list = document.getElementById('history-list');
    if (!list) return;
    list.innerHTML = '';

    const totalPages = Math.max(1, Math.ceil(filteredHistory.length / HISTORY_PER_PAGE));
    const startIdx = (historyPage - 1) * HISTORY_PER_PAGE;
    const pageData = [...filteredHistory].reverse().slice(startIdx, startIdx + HISTORY_PER_PAGE);

    if (pageData.length === 0) {
        list.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-500 text-xs">${t('noTxFound')}</td></tr>`;
    }

    pageData.forEach(tx => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-700/30 transition';

        let badge = '', amtClass = '', sign = '';
        if (tx.type === 'income') {
            badge = `<span class="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-md text-[10px]">${t('badgeIncome')}</span>`;
            amtClass = 'text-emerald-400'; sign = '+';
        } else if (tx.type === 'expense') {
            badge = `<span class="px-2 py-0.5 bg-rose-950 text-rose-400 border border-rose-800 rounded-md text-[10px]">${t('badgeExpense')}</span>`;
            amtClass = 'text-rose-400'; sign = '-';
        } else {
            badge = `<span class="px-2 py-0.5 bg-violet-950 text-violet-400 border border-violet-800 rounded-md text-[10px]">${t('badgeTransfer')}</span>`;
            amtClass = 'text-violet-400'; sign = '\u21C4';
        }

        tr.innerHTML = `
            <td class="py-2 text-[10px] text-slate-500">${escapeHtml(tx.date)}</td>
            <td class="py-2 text-[10px] text-slate-300">${escapeHtml(tx.targetName)}</td>
            <td class="py-2">${badge}</td>
            <td class="py-2 text-[10px] text-slate-400">${escapeHtml(tx.note) || '-'}</td>
            <td class="py-2 text-right ${amtClass}">${sign} \u0E3F${tx.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
        `;
        list.appendChild(tr);
    });

    const pageInfo = document.getElementById('history-page-info');
    if (pageInfo) pageInfo.textContent = `${historyPage} / ${totalPages}`;
    document.getElementById('btn-prev-page').disabled = historyPage <= 1;
    document.getElementById('btn-next-page').disabled = historyPage >= totalPages;
}

function changeHistoryPage(dir) {
    const totalPages = Math.max(1, Math.ceil(filteredHistory.length / HISTORY_PER_PAGE));
    historyPage = Math.max(1, Math.min(totalPages, historyPage + dir));
    renderHistoryPage();
}

function renderHistorySummary() {
    const el = document.getElementById('history-summary');
    if (!el) return;

    let totalIncome = 0, totalExpense = 0;
    filteredHistory.forEach(tx => {
        if (tx.type === 'income') totalIncome += tx.amount;
        else if (tx.type === 'expense') totalExpense += tx.amount;
    });

    el.innerHTML = `
        <span class="px-3 py-1 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-800">${t('summaryIncome')}\u0E3F${totalIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
        <span class="px-3 py-1 bg-rose-950 text-rose-400 rounded-lg border border-rose-800">${t('summaryExpense')}\u0E3F${totalExpense.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
        <span class="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">\u{1F4CA} ${filteredHistory.length}${t('summaryTx')}</span>
    `;
}

function renderHistoryChart() {
    const canvas = document.getElementById('historyMonthlyChart');
    if (!canvas) return;

    const monthlyData = {};
    transactions.forEach(tx => {
        const d = parseThaiDate(tx.date);
        if (!d) return;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[key]) monthlyData[key] = { income: 0, expense: 0 };
        if (tx.type === 'income') monthlyData[key].income += tx.amount;
        if (tx.type === 'expense') monthlyData[key].expense += tx.amount;
    });

    const months = Object.keys(monthlyData).sort().slice(-6);
    const labels = months.map(m => {
        const [y, mo] = m.split('-');
        return `${mo}/${parseInt(y) + 543}`;
    });

    if (window._historyChart) window._historyChart.destroy();
    window._historyChart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels.length > 0 ? labels : [t('noDataAvailable')],
            datasets: [
                {
                    label: t('chartLabelIncome'),
                    data: months.map(m => monthlyData[m].income),
                    backgroundColor: 'rgba(0, 230, 118, 0.6)',
                    borderColor: '#00e676',
                    borderWidth: 1,
                    borderRadius: 4,
                },
                {
                    label: t('chartLabelExpense'),
                    data: months.map(m => monthlyData[m].expense),
                    backgroundColor: 'rgba(255, 82, 82, 0.6)',
                    borderColor: '#ff5252',
                    borderWidth: 1,
                    borderRadius: 4,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#94a3b8', font: { size: 10 } } }
            },
            scales: {
                x: { grid: { color: 'rgba(51,65,85,0.3)' }, ticks: { color: '#94a3b8', font: { size: 9 } } },
                y: { grid: { color: 'rgba(51,65,85,0.3)' }, ticks: { color: '#94a3b8', font: { size: 9 } } }
            }
        }
    });
}

// ═══════════════════════════════════════════════════
// 📊 LIQUIDITY / FORECAST PAGE
// ═══════════════════════════════════════════════════

function updateLiquidity() {
    let totalIncomePerMonth = 0;
    let totalFixedExp = 0;
    let totalVarExp = 0;

    forecasts.incomes.forEach(inc => {
        totalIncomePerMonth += parseFloat(inc.amount) || 0;
    });

    forecasts.expenses.forEach(exp => {
        const amt = parseFloat(exp.amount) || 0;
        if (exp.category === 'fixed') totalFixedExp += amt;
        else totalVarExp += amt;
    });

    const net = totalIncomePerMonth - totalFixedExp - totalVarExp;

    document.getElementById('liq-total-income').textContent = `\u0E3F${totalIncomePerMonth.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
    document.getElementById('liq-expense-breakdown').textContent = `${totalFixedExp.toLocaleString('th-TH')} / ${totalVarExp.toLocaleString('th-TH')}`;

    const netEl = document.getElementById('liq-net');
    netEl.textContent = `\u0E3F${net.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
    netEl.className = `text-lg font-bold ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`;

    renderForecastLists();
}

function renderForecastLists() {
    const expList = document.getElementById('forecast-expense-list');
    const expEmpty = document.getElementById('forecast-expense-empty');
    if (expList) {
        expList.innerHTML = '';
        if (forecasts.expenses.length === 0) {
            if (expEmpty) expEmpty.classList.remove('hidden');
        } else {
            if (expEmpty) expEmpty.classList.add('hidden');
            forecasts.expenses.forEach((exp, idx) => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-700/30 transition';
                tr.innerHTML = `
                    <td class="py-2 text-xs text-slate-300">${escapeHtml(exp.title)}</td>
                    <td class="py-2"><span class="px-2 py-0.5 rounded-md text-[10px] ${exp.category === 'fixed' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}">${exp.category === 'fixed' ? t('fixedLabel') : t('variableLabel')}</span></td>
                    <td class="py-2 text-right text-xs text-rose-400">\u0E3F${parseFloat(exp.amount).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                    <td class="py-2 text-center">
                        <button onclick="deleteForecast('expenses', ${idx})" class="text-slate-500 hover:text-rose-400 text-[10px]">\u{1F5D1}\uFE0F</button>
                    </td>
                `;
                expList.appendChild(tr);
            });
        }
    }

    const incList = document.getElementById('forecast-income-list');
    const incEmpty = document.getElementById('forecast-income-empty');
    if (incList) {
        incList.innerHTML = '';
        if (forecasts.incomes.length === 0) {
            if (incEmpty) incEmpty.classList.remove('hidden');
        } else {
            if (incEmpty) incEmpty.classList.add('hidden');
            forecasts.incomes.forEach((inc, idx) => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-700/30 transition';
                tr.innerHTML = `
                    <td class="py-2 text-xs text-slate-300">${escapeHtml(inc.title)}</td>
                    <td class="py-2 text-right text-xs text-emerald-400">\u0E3F${parseFloat(inc.amount).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                    <td class="py-2 text-center">
                        <button onclick="deleteForecast('incomes', ${idx})" class="text-slate-500 hover:text-rose-400 text-[10px]">\u{1F5D1}\uFE0F</button>
                    </td>
                `;
                incList.appendChild(tr);
            });
        }
    }
}

function openForecastModal(type) {
    const modal = document.getElementById('forecast-modal');
    const title = document.getElementById('forecast-modal-title');
    const catGroup = document.getElementById('fc-category-group');

    if (type === 'expense') {
        title.textContent = t('modalExpenseForecast');
        catGroup.classList.remove('hidden');
    } else {
        title.textContent = t('modalIncomeForecast');
        catGroup.classList.add('hidden');
    }

    modal.dataset.type = type;
    document.getElementById('fc-title').value = '';
    document.getElementById('fc-amount').value = '';
    document.getElementById('fc-schedule').value = 'Every 1st';
    document.getElementById('fc-schedule-custom').classList.add('hidden');
    openModal('forecast-modal');
}

function submitForecast() {
    const type = document.getElementById('forecast-modal').dataset.type;
    const title = document.getElementById('fc-title').value.trim();
    const amount = parseFloat(document.getElementById('fc-amount').value);
    const category = document.getElementById('fc-category').value;
    const schedule = document.getElementById('fc-schedule').value === 'custom'
        ? document.getElementById('fc-schedule-custom').value.trim()
        : document.getElementById('fc-schedule').value;

    if (!title || !amount || amount <= 0) {
        showToast(t('fillAllInfo'), 'bg-rose-600');
        return;
    }

    if (type === 'expense') {
        forecasts.expenses.push({ title, amount, category, schedule });
    } else {
        forecasts.incomes.push({ title, amount, schedule });
    }

    closeModal('forecast-modal');
    updateUI();
    updateLiquidity();
    showToast(`\u2705 "${escapeHtml(title)}" ${currentLang === 'th' ? 'บันทึกแผนสำเร็จ' : 'saved successfully'}`);
}

function deleteForecast(type, idx) {
    forecasts[type].splice(idx, 1);
    updateUI();
    updateLiquidity();
    showToast(t('txCleared'));
}

function renderLiquidityChart() {
    const canvas = document.getElementById('liquidityChart');
    if (!canvas) return;

    let totalInc = 0, totalFixed = 0, totalVar = 0;
    forecasts.incomes.forEach(i => totalInc += parseFloat(i.amount) || 0);
    forecasts.expenses.forEach(e => {
        const a = parseFloat(e.amount) || 0;
        if (e.category === 'fixed') totalFixed += a;
        else totalVar += a;
    });

    if (window._liqChart) window._liqChart.destroy();
    window._liqChart = new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['\u{1F4B0} ' + t('chartLabelIncome'), '\u{1F3E0} ' + t('fixedLabel') + ' Cost', '\u{1F6D2} ' + t('variableLabel') + ' Cost', '\u{1F4B5} Surplus'],
            datasets: [{
                data: [totalInc, totalFixed, totalVar, Math.max(0, totalInc - totalFixed - totalVar)],
                backgroundColor: [
                    'rgba(0, 230, 118, 0.7)',
                    'rgba(255, 82, 82, 0.7)',
                    'rgba(255, 215, 64, 0.7)',
                    'rgba(68, 138, 255, 0.7)'
                ],
                borderColor: '#0a0a12',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8', font: { size: 10 }, padding: 12 }
                }
            }
        }
    });
}

document.getElementById('fc-schedule')?.addEventListener('change', function() {
    const customInput = document.getElementById('fc-schedule-custom');
    if (this.value === 'custom') {
        customInput.classList.remove('hidden');
    } else {
        customInput.classList.add('hidden');
    }
});

// ═══════════════════════════════════════════════════
// 📊 ANALYTICS MODAL
// ═══════════════════════════════════════════════════

function openAnalyticsModal(userId, userName) {
    const userTxs = transactions.filter(tx =>
        (tx.userId == userId && (tx.type === 'income' || tx.type === 'expense')) ||
        (tx.type === 'transfer' && (tx.fromUserId == userId || tx.toUserId == userId))
    );

    const ieTxs = userTxs.filter(tx => tx.type === 'income' || tx.type === 'expense');

    const todayStr = new Date().toLocaleDateString('th-TH');
    let todayIncome = 0, todayExpense = 0;

    ieTxs.forEach(tx => {
        if (!tx.date) return;
        const txDateOnly = tx.date.split(' ')[0];
        if (txDateOnly === todayStr) {
            if (tx.type === 'income') todayIncome += tx.amount;
            if (tx.type === 'expense') todayExpense += tx.amount;
        }
    });

    const avgIn7 = calculateAverage(ieTxs, 'income', 7);
    const avgIn30 = calculateAverage(ieTxs, 'income', 30);
    const avgOut7 = calculateAverage(ieTxs, 'expense', 7);
    const avgOut30 = calculateAverage(ieTxs, 'expense', 30);

    let dailyMap = {};
    userTxs.forEach(tx => {
        if (!tx.date) return;
        const dateKey = tx.date.split(' ')[0];
        if (!dailyMap[dateKey]) dailyMap[dateKey] = { income: 0, expense: 0 };
        if (tx.type === 'income') dailyMap[dateKey].income += tx.amount;
        if (tx.type === 'expense') dailyMap[dateKey].expense += tx.amount;
    });

    const dates = Object.keys(dailyMap).sort((a, b) => {
        const da = parseThaiDate(a);
        const db = parseThaiDate(b);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return da - db;
    });

    const recentDatesForTable = [...dates].reverse().slice(0, 30);

    let tableRowsHTML = '';
    if (recentDatesForTable.length === 0) {
        tableRowsHTML = `<tr><td colspan="4" class="p-4 text-center text-slate-500 text-xs">${t('noDataAvailable')}</td></tr>`;
    } else {
        recentDatesForTable.forEach(date => {
            const data = dailyMap[date];
            const net = data.income - data.expense;
            let netClass = 'text-slate-300', netSign = '';
            if (net > 0) { netClass = 'text-emerald-400 font-semibold'; netSign = '+'; }
            else if (net < 0) { netClass = 'text-rose-400 font-semibold'; }

            tableRowsHTML += `
                <tr class="border-b border-slate-800 hover:bg-slate-800/40 transition">
                    <td class="p-2 font-medium text-slate-400 text-[10px]">${escapeHtml(date)}</td>
                    <td class="p-2 text-right text-emerald-500 text-[10px]">\u0E3F${data.income.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                    <td class="p-2 text-right text-rose-500 text-[10px]">\u0E3F${data.expense.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                    <td class="p-2 text-right ${netClass} text-[10px]">${netSign}\u0E3F${net.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                </tr>
            `;
        });
    }

    document.getElementById('ana-user-name').textContent = userName;
    document.getElementById('ana-max-income').textContent = `\u0E3F${todayIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
    document.getElementById('ana-today-income').textContent = `\u0E3F${todayIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
    document.getElementById('ana-max-expense').textContent = `\u0E3F${todayExpense.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
    document.getElementById('ana-today-expense').textContent = `\u0E3F${todayExpense.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
    document.getElementById('ana-avg-in7').textContent = `\u0E3F${avgIn7}`;
    document.getElementById('ana-avg-in30').textContent = `\u0E3F${avgIn30}`;
    document.getElementById('ana-avg-out7').textContent = `\u0E3F${avgOut7}`;
    document.getElementById('ana-avg-out30').textContent = `\u0E3F${avgOut30}`;
    document.getElementById('ana-table-rows').innerHTML = tableRowsHTML;

    openModal('analytics-modal');
}

function calculateAverage(txs, type, days) {
    const filtered = txs.filter(tx => tx.type === type);
    if (filtered.length === 0) return "0.00";
    const sum = filtered.reduce((acc, tx) => acc + tx.amount, 0);
    return (sum / days).toLocaleString('th-TH', { minimumFractionDigits: 2 });
}

// ═══════════════════════════════════════════════════
// 🔔 NOTIFICATIONS
// ═══════════════════════════════════════════════════

function checkNotificationStatus() {
    const el = document.getElementById('notification-status');
    if (!el) return;

    if (!('Notification' in window)) {
        el.textContent = t('notifStatusNotSupported');
        el.className = 'inline-block px-3 py-1 rounded-full text-[10px] font-medium bg-rose-950 text-rose-400';
        return;
    }

    if (Notification.permission === 'granted') {
        el.textContent = t('notifStatusEnabled');
        el.className = 'inline-block px-3 py-1 rounded-full text-[10px] font-medium bg-emerald-950 text-emerald-400';
    } else if (Notification.permission === 'denied') {
        el.textContent = t('notifStatusBlocked');
        el.className = 'inline-block px-3 py-1 rounded-full text-[10px] font-medium bg-rose-950 text-rose-400';
    } else {
        el.textContent = t('notifStatusPending');
        el.className = 'inline-block px-3 py-1 rounded-full text-[10px] font-medium bg-amber-950 text-amber-400';
    }
}

function isChromeAndroid() {
    const ua = navigator.userAgent || '';
    return /Android/.test(ua) && /Chrome/.test(ua) && !/Firefox/.test(ua);
}

function isStandalonePWA() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

function showInstallPrompt() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choice => {
            if (choice.outcome === 'accepted') {
                showToast('✅ ติดตั้งสำเร็จ! ลองเปิดใหม่อีกครั้ง', 'bg-emerald-600');
            }
            deferredPrompt = null;
        });
    } else {
        // Manual instructions
        const msg = currentLang === 'th'
            ? '📱 Chrome ต้องติดตั้งเป็น PWA:\n1. กด⋮ (3 จุด) ด้านบน\n2. เลือก "เพิ่มลงหน้าจอหลัก"\n3. ยืนยัน "เพิ่ม"\n4. เปิดเว็บจากไอคอนบนหน้าจอ'
            : '📱 Chrome requires PWA install:\n1. Tap ⋮ (3 dots)\n2. Select "Add to Home screen"\n3. Confirm "Add"\n4. Open from home screen icon';
        alert(msg);
    }
}

function requestNotificationPermission() {
    if (!('Notification' in window)) {
        showToast(t('notifNotSupported'), 'bg-rose-600');
        return;
    }
    Notification.requestPermission().then(perm => {
        checkNotificationStatus();
        if (perm === 'granted') {
            // On Chrome Android: check if PWA is installed
            if (isChromeAndroid() && !isStandalonePWA()) {
                showToast('⚠️ Chrome ต้องติดตั้งเป็น PWA ก่อน', 'bg-amber-600');
                showInstallPrompt();
            } else {
                showToast(t('notifEnabled'));
                fireTestNotification();
            }
        } else {
            showToast(t('notifNotEnabled'), 'bg-rose-600');
        }
    });
}

function addNotificationTime() {
    const time = prompt(t('notifPrompt'));
    if (time && /^\d{1,2}:\d{2}$/.test(time.trim())) {
        notificationTimes.push(time.trim());
        localStorage.setItem('multi_notif_times', JSON.stringify(notificationTimes));
        renderNotificationTimes();
        syncSWNotificationTimes();
        showToast(`${t('notifTimeAdded')}${time.trim()}${t('notifTimeAdded2')}`);
    } else if (time) {
        showToast(t('notifTimeBadFormat'), 'bg-rose-600');
    }
}

function renderNotificationTimes() {
    const list = document.getElementById('notification-times-list');
    if (!list) return;
    list.innerHTML = '';

    notificationTimes.forEach((time, idx) => {
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center p-2 bg-slate-900/50 rounded-lg border border-slate-700/50';
        div.innerHTML = `
            <span class="text-xs text-slate-300">\u23F0 ${escapeHtml(time)}</span>
            <button onclick="removeNotificationTime(${idx})" class="text-[10px] text-rose-400 hover:text-rose-300">\u{1F5D1}\uFE0F ${currentLang === 'th' ? 'ลบ' : 'Remove'}</button>
        `;
        list.appendChild(div);
    });

    if (notificationTimes.length === 0) {
        list.innerHTML = `<p class="text-[10px] text-slate-500 text-center py-2">${currentLang === 'th' ? 'ยังไม่ได้ตั้งเวลา' : 'No notification times set'}</p>`;
    }
}

function removeNotificationTime(idx) {
    notificationTimes.splice(idx, 1);
    localStorage.setItem('multi_notif_times', JSON.stringify(notificationTimes));
    renderNotificationTimes();
    syncSWNotificationTimes();
    showToast(t('notifTimeRemoved'));
}

function fireTestNotification() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const title = t('notifTestTitle');
    const body = t('notifTestBody');
    const icon = 'https://img.magnific.com/premium-photo/tree-with-lot-money-falling-from-it_783884-278071.jpg';
    const opts = { body, icon, tag: 'wallet3-test', vibrate: [200, 100, 200] };

    // Firefox: new Notification() works fine
    if (!isChromeAndroid() || isStandalonePWA()) {
        try {
            new Notification(title, opts);
            return;
        } catch (e) { /* fallback below */ }
    }

    // Chrome Android: use ServiceWorkerRegistration.showNotification
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(reg => {
            reg.showNotification(title, { ...opts, badge: icon, requireInteraction: false, silent: false });
        }).catch(() => {});
    }
}

function testNotification() {
    if (Notification.permission !== 'granted') {
        showToast(t('notifTestPleaseEnable'), 'bg-rose-600');
        return;
    }
    fireTestNotification();
    showToast(t('notifTestSent'));
}

// ═══════════════════════════════════════════════════
// ⏰ SCHEDULED NOTIFICATIONS
// - ตรงเวลา → แจ้งทันที
// - เปิดเว็บไม่ทัน → แจ้งตอนเปิดเว็บ (ถ้ายังอยู่ในวันเดียวกัน)
// ═══════════════════════════════════════════════════

let lastNotifMinute = '';

// Get today's key like "2026-08-30"
function getTodayKey() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

// Get fired notifications for today from localStorage
function getFiredToday() {
    const key = 'wallet3_fired_' + getTodayKey();
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Mark a notification as fired today
function markFired(time) {
    const key = 'wallet3_fired_' + getTodayKey();
    const fired = getFiredToday();
    if (!fired.includes(time)) {
        fired.push(time);
        localStorage.setItem(key, JSON.stringify(fired));
    }
}

// Check if a notification was already fired today
function isFiredToday(time) {
    return getFiredToday().includes(time);
}

// Fire a notification (only Notification API, no alert)
function fireNotification(time) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if (isFiredToday(time)) return; // already fired

    const total = users ? users.reduce((sum, u) => sum + u.cash + u.bank, 0) : 0;
    const body = '💰 ยอดเงินรวม: ฿' + total.toLocaleString('th-TH', { minimumFractionDigits: 2 });
    const title = '🔔 Wallet3 — ' + time;
    const icon = 'https://img.magnific.com/premium-photo/tree-with-lot-money-falling-from-it_783884-278071.jpg';
    const opts = { body, icon, tag: 'wallet3-' + time, vibrate: [200, 100, 200] };

    // Firefox: new Notification() works fine
    if (!isChromeAndroid() || isStandalonePWA()) {
        try {
            new Notification(title, { ...opts, badge: icon, requireInteraction: false, silent: false });
            markFired(time);
            return;
        } catch (e) { /* fallback below */ }
    }

    // Chrome Android: use ServiceWorkerRegistration.showNotification
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(reg => {
            reg.showNotification(title, { ...opts, badge: icon, requireInteraction: false, silent: false }).then(() => markFired(time));
        }).catch(() => {});
    }
}

// Check scheduled notifications every minute
function checkScheduledNotifications() {
    if (!notificationTimes || notificationTimes.length === 0) return;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentMinute = hh + ':' + mm;

    if (currentMinute === lastNotifMinute) return;
    lastNotifMinute = currentMinute;

    // Fire if matches scheduled time and not yet fired today
    if (notificationTimes.includes(currentMinute) && !isFiredToday(currentMinute)) {
        fireNotification(currentMinute);
    }
}

// Check for missed notifications when app loads
function checkMissedNotifications() {
    if (!notificationTimes || notificationTimes.length === 0) return;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    notificationTimes.forEach(time => {
        const [hh, mm] = time.split(':').map(Number);
        const scheduledMinutes = hh * 60 + mm;

        // If scheduled time is earlier than now and not yet fired today
        if (scheduledMinutes <= currentMinutes && !isFiredToday(time)) {
            // Small delay so user sees the notification after page loads
            setTimeout(() => fireNotification(time), 3000);
        }
    });
}

// Start the scheduled notification checker
setInterval(checkScheduledNotifications, 30000); // Every 30 seconds

// ═══════════════════════════════════════════════════
// 📤 EXPORT / IMPORT
// ═══════════════════════════════════════════════════

function exportHistoryCSV() {
    if (filteredHistory.length === 0 && transactions.length === 0) {
        showToast(t('noTxToExport'), 'bg-rose-600');
        return;
    }

    const data = filteredHistory.length > 0 ? filteredHistory : transactions;
    let csv = 'Date,Type,Target Name,Note,Amount\n';
    data.forEach(tx => {
        const typeLabel = tx.type === 'income' ? t('txIncomeLabel') : tx.type === 'expense' ? t('txExpenseLabel') : t('txTransferLabel');
        csv += `"${tx.date}","${typeLabel}","${tx.targetName || ''}","${tx.note || ''}","${tx.amount}"\n`;
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wallet2_history_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    showToast(t('csvExported'));
}

function exportAllData() {
    const data = {
        users,
        transactions,
        forecasts,
        notificationTimes,
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wallet2_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    showToast(t('dataExported'));
}

function importAllData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.users) users = data.users;
            if (data.transactions) transactions = data.transactions;
            if (data.forecasts) forecasts = data.forecasts;
            if (data.notificationTimes) notificationTimes = data.notificationTimes;
            updateUI();
            showToast(t('dataImported'));
        } catch (err) {
            showToast(t('dataImportFail'), 'bg-rose-600');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// ═══════════════════════════════════════════════════
// 🗑️ DATA MANAGEMENT
// ═══════════════════════════════════════════════════

function openClearDataModal() {
    openModal('clear-data-modal');
    setupHoldButton('btn-hold-clear', 'hold-progress-clear', 3000, () => {
        confirmClearData();
    });
}

function confirmClearData() {
    transactions = [];
    forecasts = { expenses: [], incomes: [] };
    notificationTimes = [];
    closeModal('clear-data-modal');
    updateUI();
    showToast(t('txCleared'));
}

function openResetDataModal() {
    openModal('reset-data-modal');
    setupHoldButton('btn-hold-reset', 'hold-progress-reset', 3000, () => {
        confirmResetData();
    });
}

function confirmResetData() {
    localStorage.clear();
    loadSampleData();
    closeModal('reset-data-modal');
    updateUI();
    showToast(t('dataReset'), 'bg-rose-600');
}

// ═══════════════════════════════════════════════════
// 🛠️ UI UTILITIES
// ═══════════════════════════════════════════════════

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        const inner = modal.querySelector('.transform');
        if (inner) inner.classList.remove('scale-95');
    }, 10);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('opacity-0');
    const inner = modal.querySelector('.transform');
    if (inner) inner.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 200);
}

function showToast(msg, bgClass = 'bg-indigo-600') {
    const toast = document.getElementById('toast-box');
    const text = document.getElementById('toast-msg');
    if (!toast || !text) return;
    toast.className = `fixed bottom-20 right-5 ${bgClass} text-white font-medium text-xs px-5 py-3 rounded-xl shadow-2xl transition-all duration-300 transform z-50 flex items-center gap-2`;
    text.innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
}

function showConfirmModal(title, desc, onConfirm) {
    document.getElementById('confirm-popup-title').innerText = title;
    document.getElementById('confirm-popup-desc').innerText = desc;
    openModal('confirm-popup');
    document.getElementById('confirm-popup-ok-btn').onclick = function() {
        onConfirm();
        closeModal('confirm-popup');
    };
}

function showInputModal(title, desc, defaultVal, onSave) {
    document.getElementById('input-popup-title').innerText = title;
    document.getElementById('input-popup-desc').innerText = desc;
    const input = document.getElementById('input-popup-field');
    input.value = defaultVal;
    openModal('input-popup');
    document.getElementById('input-popup-save-btn').onclick = function() {
        if (!input.value.trim()) { showToast(t('fillAllInfo'), 'bg-rose-600'); return; }
        onSave(input.value.trim());
        closeModal('input-popup');
    };
}

function openDeleteUserModal(id, name) {
    if (users.length <= 1) { showToast(t('fillAllInfo'), 'bg-rose-600'); return; }
    userIdToDelete = id;
    document.getElementById('del-popup-title').innerText = `${t('removePerson')} — ${name}`;
    openModal('delete-user-popup');
    setupHoldButton('btn-hold-delete', 'hold-progress-delete', 3000, () => {
        users = users.filter(u => u.id !== userIdToDelete);
        closeModal('delete-user-popup');
        updateUI();
        showToast(t('txDeleted'), 'bg-rose-600');
    });
}

function triggerDeleteTransaction(txId) {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    showConfirmModal(
        t('txDeletedConfirm'),
        `${t('txDeleteDesc1')}"${tx.note || tx.type}"${t('txDeleteDesc2')}\u0E3F${tx.amount.toLocaleString()}`,
        () => {
            if (tx.type === 'income' || tx.type === 'expense') {
                const user = users.find(u => u.id == tx.userId);
                if (user && tx.walletType) {
                    if (tx.type === 'income') user[tx.walletType] -= tx.amount;
                    else if (tx.type === 'expense') user[tx.walletType] += tx.amount;
                }
            } else if (tx.type === 'transfer') {
                const fromUser = users.find(u => u.id == tx.fromUserId);
                const toUser = users.find(u => u.id == tx.toUserId);
                if (fromUser && tx.fromType) fromUser[tx.fromType] += tx.amount;
                if (toUser && tx.toType) toUser[tx.toType] -= tx.amount;
            }
            transactions = transactions.filter(t => t.id !== txId);
            updateUI();
            showToast(t('txDeletedSuccess'));
        }
    );
}

function createUser() {
    const nameInput = document.getElementById('new-user-name');
    const cashInput = document.getElementById('init-cash');
    const bankInput = document.getElementById('init-bank');

    const name = nameInput.value.trim();
    const cash = parseFloat(cashInput.value) || 0;
    const bank = parseFloat(bankInput.value) || 0;

    if (!name) { showToast(t('fillAllInfo'), 'bg-rose-600'); return; }

    const newId = Date.now();
    users.push({ id: newId, name: name, cash: cash, bank: bank });

    if (cash > 0 && bank > 0) {
        transactions.push({
            id: Date.now() + 1, userId: newId, walletType: 'cash',
            date: new Date().toLocaleString('th-TH', { hour12: false }),
            targetName: `${name} (${currentLang === 'th' ? 'เพิ่มใหม่' : 'Just Added'})`, type: 'income', note: currentLang === 'th' ? 'เงินตั้งต้น (เงินสด)' : 'Initial deposit (Cash)', amount: cash
        });
        transactions.push({
            id: Date.now() + 2, userId: newId, walletType: 'bank',
            date: new Date().toLocaleString('th-TH', { hour12: false }),
            targetName: `${name} (${currentLang === 'th' ? 'เพิ่มใหม่' : 'Just Added'})`, type: 'income', note: currentLang === 'th' ? 'เงินตั้งต้น (ธนาคาร)' : 'Initial deposit (Bank)', amount: bank
        });
    } else if (cash > 0) {
        transactions.push({
            id: Date.now() + 1, userId: newId, walletType: 'cash',
            date: new Date().toLocaleString('th-TH', { hour12: false }),
            targetName: `${name} (${currentLang === 'th' ? 'เพิ่มใหม่' : 'Just Added'})`, type: 'income', note: currentLang === 'th' ? 'เงินตั้งต้น' : 'Initial deposit', amount: cash
        });
    } else if (bank > 0) {
        transactions.push({
            id: Date.now() + 1, userId: newId, walletType: 'bank',
            date: new Date().toLocaleString('th-TH', { hour12: false }),
            targetName: `${name} (${currentLang === 'th' ? 'เพิ่มใหม่' : 'Just Added'})`, type: 'income', note: currentLang === 'th' ? 'เงินตั้งต้น' : 'Initial deposit', amount: bank
        });
    }

    nameInput.value = ''; cashInput.value = '0'; bankInput.value = '0';
    updateUI();
    showToast(t('personAdded'));
}

function addTransaction() {
    const walletKey = document.getElementById('ie-wallet-select').value;
    const type = document.getElementById('ie-type').value;
    const amount = parseFloat(document.getElementById('ie-amount').value);
    const note = document.getElementById('ie-note').value.trim();

    if (!walletKey || !amount || amount <= 0) { showToast(t('fillAllInfo'), 'bg-rose-600'); return; }

    const [userId, walletType] = walletKey.split('-');
    const user = users.find(u => u.id == userId);
    if (!user) { showToast(t('noPerson'), 'bg-rose-600'); return; }

    const performAction = () => {
        if (type === 'income') user[walletType] += amount;
        else user[walletType] -= amount;

        transactions.push({
            id: Date.now(), userId: userId, walletType: walletType,
            date: new Date().toLocaleString('th-TH', { hour12: false }),
            targetName: `${user.name} (${walletType === 'cash' ? t('walletLabelCash') : t('walletLabelBank')})`,
            type: type, note: note, amount: amount
        });

        document.getElementById('ie-amount').value = '';
        document.getElementById('ie-note').value = '';
        // Remember the last selected type
        lastTxType = type;
        localStorage.setItem('wallet2_last_tx_type', type);
        updateUI();
        showToast(t('txRecorded'));
    };

    if (type === 'expense' && user[walletType] < amount) {
        showConfirmModal(t('insufficientFunds'), t('insufficientFundsDesc'), performAction);
    } else {
        performAction();
    }
}

function transferMoney() {
    const fromKey = document.getElementById('tf-from-select').value;
    const toKey = document.getElementById('tf-to-select').value;
    const amount = parseFloat(document.getElementById('tf-amount').value);

    if (!fromKey || !toKey || !amount || amount <= 0) { showToast(t('fillTransferInfo'), 'bg-rose-600'); return; }
    if (fromKey === toKey) { showToast(t('sameWallet'), 'bg-rose-600'); return; }

    const [fromUserId, fromType] = fromKey.split('-');
    const [toUserId, toType] = toKey.split('-');

    const fromUser = users.find(u => u.id == fromUserId);
    const toUser = users.find(u => u.id == toUserId);

    if (!fromUser || !toUser) { showToast(t('noPersonFound'), 'bg-rose-600'); return; }
    if (fromUser[fromType] < amount) { showToast(`${t('balanceNotEnough')}${fromUser.name}`, 'bg-rose-600'); return; }

    fromUser[fromType] -= amount;
    toUser[toType] += amount;

    transactions.push({
        id: Date.now(), fromUserId: fromUserId, fromType: fromType, toUserId: toUserId, toType: toType,
        date: new Date().toLocaleString('th-TH', { hour12: false }),
        targetName: `${fromUser.name}(${fromType === 'cash' ? t('walletLabelCash') : t('walletLabelBank')}) \u2794 ${toUser.name}(${toType === 'cash' ? t('walletLabelCash') : t('walletLabelBank')})`,
        type: 'transfer', note: t('transferNote'), amount: amount
    });

    document.getElementById('tf-amount').value = '';
    updateUI();
    showToast(t('transferDone'));
}

function switchTab(tab) {
    const ieForm = document.getElementById('form-income-expense');
    const tfForm = document.getElementById('form-transfer');
    const tabIe = document.getElementById('tab-ie');
    const tabTf = document.getElementById('tab-tf');

    if (tab === 'income-expense') {
        if (ieForm) ieForm.classList.remove('hidden');
        if (tfForm) tfForm.classList.add('hidden');
        if (tabIe) tabIe.className = "py-2 px-4 font-medium text-xs text-indigo-400 border-b-2 border-indigo-500 focus:outline-none";
        if (tabTf) tabTf.className = "py-2 px-4 font-medium text-xs text-slate-400 hover:text-indigo-400 focus:outline-none";
    } else {
        if (ieForm) ieForm.classList.add('hidden');
        if (tfForm) tfForm.classList.remove('hidden');
        if (tabTf) tabTf.className = "py-2 px-4 font-medium text-xs text-indigo-400 border-b-2 border-indigo-500 focus:outline-none";
        if (tabIe) tabIe.className = "py-2 px-4 font-medium text-xs text-slate-400 hover:text-indigo-400 focus:outline-none";
    }
}

// ═══════════════════════════════════════════════════
// 🎲 SAMPLE DATA GENERATOR
// ═══════════════════════════════════════════════════

function loadSampleData() {
    users = [
        { id: 1, name: t('sampleUserNames')[1], cash: 500, bank: 3000 },
        { id: 2, name: t('sampleUserNames')[2], cash: 1200, bank: 7500 },
        { id: 3, name: t('sampleUserNames')[3], cash: 800, bank: 5000 }
    ];

    forecasts = {
        expenses: [
            { title: currentLang === 'th' ? 'ค่าเช่าบ้าน' : 'Rent', category: 'fixed', amount: 8500, schedule: 'Every 5th' },
            { title: currentLang === 'th' ? 'ค่าผ่อนรถ' : 'Car Loan', category: 'fixed', amount: 12000, schedule: 'Every 28th' },
            { title: currentLang === 'th' ? 'ค่าอินเทอร์เน็ต' : 'Internet Fee', category: 'fixed', amount: 599, schedule: 'Every 10th' },
            { title: currentLang === 'th' ? 'ค่าอาหาร' : 'Groceries', category: 'variable', amount: 1200, schedule: 'Every 15th' },
            { title: currentLang === 'th' ? 'บันเทิง' : 'Entertainment', category: 'variable', amount: 2000, schedule: 'Weekly' }
        ],
        incomes: [
            { title: currentLang === 'th' ? 'เงินเดือนรายเดือน' : 'Monthly Salary', amount: 45000, schedule: 'Every 25th' },
            { title: currentLang === 'th' ? 'รายได้เสริม' : 'Freelance Income', amount: 3500, schedule: 'Weekly' }
        ]
    };

    notificationTimes = ['08:00', '12:00', '20:00'];

    transactions = [];
    const expenseTitles = t('sampleExpenseTitles');
    const incomeTitles = t('sampleIncomeTitles');

    const now = new Date();
    for (let i = 0; i < 50; i++) {
        const daysAgo = Math.floor(Math.random() * 90);
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);
        date.setHours(Math.floor(Math.random() * 14) + 7);
        date.setMinutes(Math.floor(Math.random() * 60));

        const isIncome = Math.random() < 0.3;
        const userId = [1, 2, 3][Math.floor(Math.random() * 3)];
        const walletType = Math.random() < 0.6 ? 'cash' : 'bank';
        const userName = users.find(u => u.id === userId)?.name || (currentLang === 'th' ? 'บางคน' : 'Someone');
        const walletLabel = walletType === 'cash' ? t('walletLabelCash') : t('walletLabelBank');

        const txDate = date.toLocaleString('th-TH', { hour12: false });

        if (isIncome) {
            const amt = parseFloat((Math.random() * 5000 + 500).toFixed(2));
            transactions.push({
                id: Date.now() + i, userId: userId, walletType: walletType,
                date: txDate, targetName: `${userName} (${walletLabel})`,
                type: 'income', note: incomeTitles[Math.floor(Math.random() * incomeTitles.length)],
                amount: amt
            });
        } else {
            const amt = parseFloat((Math.random() * 2000 + 50).toFixed(2));
            transactions.push({
                id: Date.now() + i + 1000, userId: userId, walletType: walletType,
                date: txDate, targetName: `${userName} (${walletLabel})`,
                type: 'expense', note: expenseTitles[Math.floor(Math.random() * expenseTitles.length)],
                amount: amt
            });
        }
    }

    for (let i = 0; i < 5; i++) {
        const fromUser = users[i % 3];
        const toUser = users[(i + 1) % 3];
        const fromType = Math.random() < 0.5 ? 'cash' : 'bank';
        const toType = Math.random() < 0.5 ? 'cash' : 'bank';
        const amt = parseFloat((Math.random() * 3000 + 100).toFixed(2));
        const daysAgo = Math.floor(Math.random() * 60);
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);

        transactions.push({
            id: Date.now() + 2000 + i,
            fromUserId: fromUser.id, fromType: fromType,
            toUserId: toUser.id, toType: toType,
            date: date.toLocaleString('th-TH', { hour12: false }),
            targetName: `${fromUser.name}(${fromType === 'cash' ? t('walletLabelCash') : t('walletLabelBank')}) \u2794 ${toUser.name}(${toType === 'cash' ? t('walletLabelCash') : t('walletLabelBank')})`,
            type: 'transfer', note: t('transferNote'), amount: amt
        });
    }

    transactions.sort((a, b) => {
        const da = new Date(a.date);
        const db = new Date(b.date);
        return db - da;
    });
}

// ═══════════════════════════════════════════════════
// 🚀 INIT
// ═══════════════════════════════════════════════════

// Load sample data if no saved data exists
if (!users || users.length === 0) {
    loadSampleData();
}
if (!transactions) transactions = [];
if (!forecasts) forecasts = { expenses: [], incomes: [] };

// Apply language on load
const langSelect = document.getElementById('lang-select');
if (langSelect) langSelect.value = currentLang;
applyTranslations();
updateUI();

// Restore last selected transaction type
const ieTypeSelect = document.getElementById('ie-type');
if (ieTypeSelect && lastTxType) {
    ieTypeSelect.value = lastTxType;
}

// Check for missed notifications when app loads
setTimeout(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
        checkMissedNotifications();
    }
}, 2000);
