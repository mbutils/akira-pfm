export const SALES_CONS = {
    // BuyType: {
    //     full: 'Trả 1 lần',
    //     installment: 'Trả góp',
    //     later: 'Trả sau',
    // },
    BuyType: [
        { value: 'full', label: 'Trả 1 lần' },
        { value: 'installment', label: 'Trả góp' },
        { value: 'later', label: 'Trả sau' },
    ],
    Status: {
        sold: 'Đã hết',
        stored: 'Còn hàng',
        imported: 'Chờ về',
    },
    StatusOptions: [
        { value: 'sold', label: 'Đã hết' },
        { value: 'stored', label: 'Còn hàng' },
        { value: 'imported', label: 'Chờ về' },
    ]
}