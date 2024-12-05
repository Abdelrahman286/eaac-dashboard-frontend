# Get Coupons

url : api/discount/getDiscount

request body :

{
"id" : 1,
"disabled" : 1,
"search" : "Voucher"
}

# Create Coupon

url : api/discount/getDiscount
request Body : {
"voucherCode" : "911",
"discountPercentage" : 33,
"percentageFlag" : 0
}

# Update Coupon

url : /api/discount/updateDiscountVoucher
request body :
{
"id" : [1],
"voucherCode" : "Test Voucher",
"discountPercentage" : 33,
"percentageFlag" : 0 ,

}
