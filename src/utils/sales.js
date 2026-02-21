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
        { value: 'imported', label: 'Chờ về' },
        { value: 'stored', label: 'Còn hàng' },
        { value: 'sold', label: 'Đã hết' },
    ],
    ProductTypeOptions: [
        { value: 'product', label: 'Sản phẩm' },
        { value: 'gold', label: 'Vàng' },
        { value: 'stock', label: 'Chứng khoán' },
    ],
}