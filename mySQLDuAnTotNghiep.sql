create database CoffeeShopManager;
use CoffeeShopManager;

create table Users (
userID varchar(20) character set utf8mb4 primary key,
fullName varchar(70) character set utf8mb4,
email varchar(50) CHARACTER SET utf8mb4,
sdt varchar(11),
userPwd varchar(2000) CHARACTER SET utf8mb4,
userRole tinyint(1) default 0,
userStatus tinyint(1) default 1
);

create table Product(
	productID int auto_increment primary key,
    productName varchar(100) CHARACTER SET utf8mb4 not null,
    price decimal(10,2) NOT NULL CHECK (price >= 0),
    image_path nvarchar(500),
    productStatus tinyint(1) default 1,
    detail varchar(500) CHARACTER SET utf8mb4,
    productType enum("Coffee","Tea","Cake","Fruit Tea","Fruit Puree") CHARACTER SET utf8mb4 not null default "Coffee"
);

create table tblTable
(
	tableID int primary key,
    tableStatus enum("Trống","Đã có khách") default "Trống"
);



create table Orders(
	orderID int auto_increment primary key,
    OrderName varchar(70) character set utf8mb4 default "Khách lẻ",
    userID varchar(20) character set utf8mb4 null,
    tableID int,
	sdt varchar(11) character set utf8mb4 not null default "0000000000",
    total decimal(10,2) not null default 0,
    note varchar(200) CHARACTER SET utf8mb4,
    orderDate timestamp default current_timestamp,
    orderStatus enum("Xác nhận","Đang làm","Hoàn thành","Đã thanh toán","Đã hủy") default "Xác nhận",
    foreign key (userID) references Users(userID) On delete set null,
    foreign key (tableID) references tblTable(tableID) on delete set null
);

create table OrderDetails(
	OrderDetailID int auto_increment primary key,
    subtotal decimal(10,2) not null,
    quantity int,
    productID int,
    OrderID int,
    foreign key (productID) references Product(productID) on delete set null,
    foreign key (OrderID) references Orders(OrderID) on delete set null,
    CONSTRAINT unique_order_product UNIQUE (OrderID, productID)
);

create table Ingredient(
	ingredientId int auto_increment primary key,
    ingredientName varchar(100) character set utf8mb4 not null,
    price decimal(10,2) not null,
    quantity decimal(5,2) not null
);

create table Statistical_Ingredient(
	stIngredientId int auto_increment primary key,
    ingredientId int,
    userID varchar(20) character set utf8mb4 not null,
    quantity decimal(5,2) not null,
    stIngredientDate timestamp default current_timestamp,
	note varchar(500) character set utf8mb4,
    ingredientName varchar(100) character set utf8mb4 not null,
    foreign key (ingredientId) references Ingredient(ingredientId) On delete set null,
    foreign key (userID) references Users(userID) On delete set null
);
use coffeeshopmanager;
CREATE TABLE tb_transactions (
    id int(11) NOT NULL AUTO_INCREMENT primary key,
    gateway varchar(100) character set utf8mb4 NOT NULL,
    transaction_date timestamp NOT NULL DEFAULT current_timestamp,
    account_number varchar(100) character set utf8mb4 DEFAULT NULL,
    sub_account varchar(250) character set utf8mb4 DEFAULT NULL,
    amount_in decimal(20,2) NOT NULL DEFAULT 0.00,
    amount_out decimal(20,2) NOT NULL DEFAULT 0.00,
    accumulated decimal(20,2) NOT NULL DEFAULT 0.00,
    codes varchar(250) DEFAULT NULL,
    transaction_content text DEFAULT NULL,
    reference_number varchar(255) character set utf8mb4 DEFAULT NULL,
    body text DEFAULT NULL,
    created_at timestamp NOT NULL DEFAULT current_timestamp()
);

DELIMITER //

CREATE TRIGGER before_insert_users
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    DECLARE lastName VARCHAR(50);
    DECLARE firstLetterOfSurname VARCHAR(1);
    DECLARE firstLetterOfMiddleName VARCHAR(1);
    DECLARE tempName VARCHAR(100);
    DECLARE randomSuffix VARCHAR(10);
    
    -- Lấy phần TÊN (từ cuối cùng)
    SET tempName = TRIM(NEW.fullName);  -- Loại bỏ khoảng trắng đầu/cuối
    SET lastName = RIGHT(tempName, LOCATE(' ', REVERSE(tempName)) - 1);  -- Tìm tên cuối cùng (họ)
    
    -- Lấy chữ cái đầu của họ
    SET firstLetterOfSurname = LEFT(lastName, 1);  -- Lấy chữ cái đầu tiên của họ
    
    -- Lấy chữ cái đầu của tên đệm (nếu có)
    SET firstLetterOfMiddleName = '';  -- Nếu không có tên đệm, để trống
    IF LOCATE(' ', tempName) > 0 THEN
        SET firstLetterOfMiddleName = LOWER(MID(tempName, LOCATE(' ', tempName) + 1, 1));  -- Lấy chữ cái đầu của tên đệm
    END IF;
    
    -- Sinh một chuỗi ngẫu nhiên (ví dụ: 4 chữ số ngẫu nhiên)
    SET randomSuffix = FLOOR(RAND() * 10000);  -- Tạo số ngẫu nhiên từ 0 đến 9999
    
    -- Gán giá trị vào userID (ID là sự kết hợp của họ, tên đệm và một chuỗi ngẫu nhiên)
    SET NEW.userID = CONCAT(firstLetterOfSurname, firstLetterOfMiddleName, lastName, randomSuffix);
END;

//

DELIMITER ;

