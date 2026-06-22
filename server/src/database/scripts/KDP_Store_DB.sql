
-- =========================================================================
-- KHỞI TẠO EXTENSION CẦN THIẾT
-- =========================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- PHÂN HỆ 1: NGƯỜI DÙNG & ĐĂNG NHẬP (LƯU ĐỊA CHỈ BẰNG JSONB)
-- =========================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255), 
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(512),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')), 
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Mảng JSONB chứa các địa chỉ của user. 
    -- Format: [{"name": "A", "phone": "...", "address": "...", "is_default": true}]
    addresses JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bảng OAuth bắt buộc phải tách riêng để dùng UNIQUE Constraint cho provider_id
CREATE TABLE user_identities (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, 
    provider_id VARCHAR(255) NOT NULL, 
    provider_email VARCHAR(150),
    access_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_id) 
);

-- =========================================================================
-- PHÂN HỆ 2: DANH MỤC & SẢN PHẨM 3D
-- =========================================================================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    sort_order INT DEFAULT 0,
    image_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL, 
    price DECIMAL(12, 2) NOT NULL,
    discount_price DECIMAL(12, 2),
    original_price DECIMAL(12, 2),
    sale_start_date TIMESTAMP WITH TIME ZONE,
    sale_end_date TIMESTAMP WITH TIME ZONE,
    condition VARCHAR(100) DEFAULT 'Mới 95%',
    import_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    stock INT DEFAULT 0 CHECK (stock >= 0),
    is_published BOOLEAN DEFAULT TRUE,
    
    -- Lưu mảng link ảnh 2D thay vì 1 ảnh duy nhất: ["url1.jpg", "url2.jpg"]
    images_2d JSONB DEFAULT '[]'::jsonb, 
    
    model_3d_url VARCHAR(512), 
    scale_x FLOAT DEFAULT 1.0,
    scale_y FLOAT DEFAULT 1.0,
    scale_z FLOAT DEFAULT 1.0,
    rotation_x FLOAT DEFAULT 0.0,
    rotation_y FLOAT DEFAULT 0.0,
    rotation_z FLOAT DEFAULT 0.0,
    materials_config JSONB DEFAULT '{"colors": [], "textures": []}'::jsonb,
    camera_config JSONB DEFAULT '{"alpha": 0, "beta": 1, "radius": 5}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- PHÂN HỆ 3: GIỎ HÀNG (LƯU ITEMS BẰNG JSONB)
-- =========================================================================

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE, 
    
    -- Mảng chứa các món hàng. Không cần lưu giá ở đây vì giá có thể thay đổi.
    -- Format: [{"product_id": 1, "quantity": 2, "selected_color": "#FF0000"}]
    items JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- PHÂN HỆ 4: ĐƠN HÀNG & THANH TOÁN (GỘP CHUNG VÀO 1 BẢNG BẰNG JSONB)
-- =========================================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, 
    total_amount DECIMAL(12, 2) NOT NULL,
    shipping_fee DECIMAL(12, 2) DEFAULT 0.00,
    final_amount DECIMAL(12, 2) NOT NULL, 
    
    -- Snapshot người nhận
    shipping_name VARCHAR(100) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    
    -- SNAPSHOT SẢN PHẨM (Cực kỳ quan trọng: Lưu lại tên và giá lúc mua)
    -- Format: [{"product_id": 1, "name": "Sofa", "quantity": 1, "price": 3450000, "color": "#000"}]
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- THÔNG TIN THANH TOÁN
    -- Format: {"method": "VNPAY", "transaction_id": "VN123456", "status": "completed", "paid_at": "2026-06-16..."}
    payment_info JSONB DEFAULT '{"method": "COD", "status": "pending"}'::jsonb,
    
    order_status VARCHAR(30) DEFAULT 'pending', 
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- PHÂN HỆ 5: ĐÁNH GIÁ (REVIEWS)
-- =========================================================================
-- Đánh giá vẫn nên để bảng riêng để dễ dàng JOIN tính điểm trung bình (AVG) cho sản phẩm
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- ĐÁNH CHỈ MỤC (INDEXING)
-- =========================================================================
CREATE INDEX idx_user_identities_provider ON user_identities(provider, provider_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);

-- Tạo Index GIN cho JSONB (Tăng tốc độ tìm kiếm bên trong mảng JSON nếu cần)
CREATE INDEX idx_orders_items ON orders USING GIN (items);