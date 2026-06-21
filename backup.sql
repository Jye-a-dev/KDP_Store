--
-- PostgreSQL database dump
--


-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.user_identities DROP CONSTRAINT IF EXISTS user_identities_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_user_id_fkey;
DROP INDEX IF EXISTS public.idx_user_identities_provider;
DROP INDEX IF EXISTS public.idx_reviews_product;
DROP INDEX IF EXISTS public.idx_products_slug;
DROP INDEX IF EXISTS public.idx_products_category;
DROP INDEX IF EXISTS public.idx_orders_items;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.user_identities DROP CONSTRAINT IF EXISTS user_identities_provider_provider_id_key;
ALTER TABLE IF EXISTS ONLY public.user_identities DROP CONSTRAINT IF EXISTS user_identities_pkey;
ALTER TABLE IF EXISTS ONLY public.static_pages DROP CONSTRAINT IF EXISTS static_pages_slug_key;
ALTER TABLE IF EXISTS ONLY public.static_pages DROP CONSTRAINT IF EXISTS static_pages_pkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_pkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_slug_key;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_sku_key;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.page_contents DROP CONSTRAINT IF EXISTS page_contents_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_slug_key;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_user_id_key;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_pkey;
ALTER TABLE IF EXISTS public.user_identities ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.static_pages ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.reviews ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.products ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.user_identities_id_seq;
DROP TABLE IF EXISTS public.user_identities;
DROP SEQUENCE IF EXISTS public.static_pages_id_seq;
DROP TABLE IF EXISTS public.static_pages;
DROP SEQUENCE IF EXISTS public.reviews_id_seq;
DROP TABLE IF EXISTS public.reviews;
DROP SEQUENCE IF EXISTS public.products_id_seq;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.page_contents;
DROP TABLE IF EXISTS public.orders;
DROP SEQUENCE IF EXISTS public.categories_id_seq;
DROP TABLE IF EXISTS public.categories;
DROP TABLE IF EXISTS public.carts;
DROP EXTENSION IF EXISTS "uuid-ossp";
--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    items jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    parent_id integer,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    show_on_navbar boolean DEFAULT false
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    total_amount numeric(12,2) NOT NULL,
    shipping_fee numeric(12,2) DEFAULT 0.00,
    final_amount numeric(12,2) NOT NULL,
    shipping_name character varying(100) NOT NULL,
    shipping_phone character varying(20) NOT NULL,
    shipping_address text NOT NULL,
    items jsonb DEFAULT '[]'::jsonb NOT NULL,
    payment_info jsonb DEFAULT '{"method": "COD", "status": "pending"}'::jsonb,
    order_status character varying(30) DEFAULT 'pending'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: page_contents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_contents (
    key character varying(100) NOT NULL,
    value text NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    category_id integer,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    sku character varying(50) NOT NULL,
    price numeric(12,2) NOT NULL,
    discount_price numeric(12,2),
    description text,
    stock integer DEFAULT 0,
    is_published boolean DEFAULT true,
    images_2d jsonb DEFAULT '[]'::jsonb,
    model_3d_url character varying(512),
    scale_x double precision DEFAULT 1.0,
    scale_y double precision DEFAULT 1.0,
    scale_z double precision DEFAULT 1.0,
    rotation_x double precision DEFAULT 0.0,
    rotation_y double precision DEFAULT 0.0,
    rotation_z double precision DEFAULT 0.0,
    materials_config jsonb DEFAULT '{"colors": [], "textures": []}'::jsonb,
    camera_config jsonb DEFAULT '{"beta": 1, "alpha": 0, "radius": 5}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    badge character varying(100) DEFAULT NULL::character varying,
    condition character varying(100) DEFAULT 'Mới 95%'::character varying,
    import_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    original_price numeric(12,2),
    CONSTRAINT products_stock_check CHECK ((stock >= 0))
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id uuid,
    product_id integer,
    rating integer NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: static_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.static_pages (
    id integer NOT NULL,
    slug character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    group_type character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: static_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.static_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: static_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.static_pages_id_seq OWNED BY public.static_pages.id;


--
-- Name: user_identities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_identities (
    id integer NOT NULL,
    user_id uuid,
    provider character varying(50) NOT NULL,
    provider_id character varying(255) NOT NULL,
    provider_email character varying(150),
    access_token text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: user_identities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_identities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_identities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_identities_id_seq OWNED BY public.user_identities.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255),
    full_name character varying(100) NOT NULL,
    phone character varying(20),
    avatar_url character varying(512),
    role character varying(20) DEFAULT 'customer'::character varying,
    is_active boolean DEFAULT true,
    addresses jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['customer'::character varying, 'admin'::character varying])::text[])))
);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: static_pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.static_pages ALTER COLUMN id SET DEFAULT nextval('public.static_pages_id_seq'::regclass);


--
-- Name: user_identities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_identities ALTER COLUMN id SET DEFAULT nextval('public.user_identities_id_seq'::regclass);


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categories VALUES (13, NULL, 'Nội Thất', 'noi-that', '2026-06-17 07:31:02.798163+07', true);
INSERT INTO public.categories VALUES (2, NULL, 'Trang sức', 'trang-suc', '2026-06-17 07:07:14.04609+07', true);
INSERT INTO public.categories VALUES (3, NULL, 'Đồ điện tử', 'do-dien-tu', '2026-06-17 07:07:14.04609+07', true);
INSERT INTO public.categories VALUES (19, NULL, 'Trang Phục', 'trang-phuc', '2026-06-20 17:05:25.843483+07', true);
INSERT INTO public.categories VALUES (1, 19, 'Trang phục nam', 'trang-phuc-nam', '2026-06-17 07:07:14.04609+07', true);
INSERT INTO public.categories VALUES (4, 19, 'Trang phục nữ', 'trang-phuc-nu', '2026-06-17 07:07:14.04609+07', true);
INSERT INTO public.categories VALUES (20, NULL, 'Giày', 'giay', '2026-06-21 10:18:32.954848+07', true);


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.orders VALUES ('136148fb-0076-4393-a6d8-6a5525efeffe', 'fa4a109b-0e7f-43c0-a4c5-b451a7f887cb', 1455740.00, 30000.00, 1485740.00, 'user1', '09678456535', 'afasdasdads', '[{"name": "Mens Cotton Jacket", "color": "#03AED2", "price": 1455740, "quantity": 1, "product_id": 83}]', '{"method": "COD", "status": "pending"}', 'cancelled', '2026-06-19 23:41:57.364806+07', '2026-06-19 23:43:56.651528+07');
INSERT INTO public.orders VALUES ('bd65af58-894f-4aa1-89b0-77ad483f7cef', 'fa4a109b-0e7f-43c0-a4c5-b451a7f887cb', 49347220.00, 30000.00, 49377220.00, 'user1', '13123', 'q4 asdasda', '[{"name": "Sofa da cao cấp Luxury - Premium Leather Sofa", "color": "#03AED2", "price": 23399740, "quantity": 1, "product_id": 101}, {"name": "Bàn trang điểm đèn LED hiện đại - Dressing Table with LED", "color": "#03AED2", "price": 7279740, "quantity": 1, "product_id": 117}, {"name": "White Gold Plated Princess", "color": "#03AED2", "price": 259740, "quantity": 1, "product_id": 87}, {"name": "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin", "color": "#03AED2", "price": 15574000, "quantity": 1, "product_id": 93}, {"name": "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5", "color": "#03AED2", "price": 2834000, "quantity": 1, "product_id": 91}]', '{"method": "MOMO", "status": "pending"}', 'delivered', '2026-06-20 17:20:10.819936+07', '2026-06-20 17:20:53.260709+07');
INSERT INTO public.orders VALUES ('6c072c55-6046-46b8-b74f-7b3340681432', 'fa4a109b-0e7f-43c0-a4c5-b451a7f887cb', 25999480.00, 30000.00, 26029480.00, 'khoa', '0950348313', 'qwdased', '[{"name": "Bàn trà gỗ sồi tự nhiên - Oak Coffee Table", "color": "#03AED2", "price": 5199740, "quantity": 1, "product_id": 103}, {"name": "Giường ngủ gỗ Walnut cao cấp - Walnut Queen Bed Frame", "color": "#F8DE22", "price": 20799740, "quantity": 1, "product_id": 106}]', '{"method": "MOMO", "status": "pending"}', 'pending', '2026-06-20 17:35:25.932745+07', '2026-06-20 17:35:25.932745+07');
INSERT INTO public.orders VALUES ('aba16e6e-3a04-4d41-a16b-5f2e4ae46d7f', 'fa4a109b-0e7f-43c0-a4c5-b451a7f887cb', 25999480.00, 30000.00, 26029480.00, 'user1', '1321413123', '1231', '[{"name": "Bàn trà gỗ sồi tự nhiên - Oak Coffee Table", "color": "#03AED2", "price": 5199740, "quantity": 1, "product_id": 103}, {"name": "Giường ngủ gỗ Walnut cao cấp - Walnut Queen Bed Frame", "color": "#F8DE22", "price": 20799740, "quantity": 1, "product_id": 106}]', '{"method": "MOMO", "status": "paid"}', 'shipped', '2026-06-20 17:29:58.582193+07', '2026-06-20 17:38:53.398939+07');


--
-- Data for Name: page_contents; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.page_contents VALUES ('announcement_bar', 'Săn Deal Khởi Động Hè - Nhập mã "NewSale_2026" giảm thêm 15%', '2026-06-19 18:30:05.459264+07');
INSERT INTO public.page_contents VALUES ('hero_tagline', 'Drop 01 // Xu Hướng Đột Phá', '2026-06-19 18:30:05.466189+07');
INSERT INTO public.page_contents VALUES ('hero_title_normal', 'Bứt phá', '2026-06-19 18:30:05.467387+07');
INSERT INTO public.page_contents VALUES ('hero_title_highlight', 'Màu Sắc', '2026-06-19 18:30:05.468242+07');
INSERT INTO public.page_contents VALUES ('hero_description', 'Đập tan sự đơn điệu với những thiết kế Oversize và nội thất tương tác 3D mang tuyên ngôn cá tính mạnh mẽ.', '2026-06-19 18:30:05.469074+07');
INSERT INTO public.page_contents VALUES ('hero_btn', 'Mua Ngay Cực Cháy', '2026-06-19 18:30:05.469836+07');
INSERT INTO public.page_contents VALUES ('newsletter_placeholder', 'Nhập email của bạn...', '2026-06-19 18:30:05.472486+07');
INSERT INTO public.page_contents VALUES ('newsletter_btn', 'Đăng Ký', '2026-06-19 18:30:05.473174+07');
INSERT INTO public.page_contents VALUES ('customer_promo_title', 'Ưu đãi dành riêng cho bạn', '2026-06-19 18:30:05.47423+07');
INSERT INTO public.page_contents VALUES ('customer_promo_desc', 'giảm thêm 15%', '2026-06-19 18:30:05.475274+07');
INSERT INTO public.page_contents VALUES ('customer_promo_btn', 'Mua Ngay', '2026-06-19 18:30:05.475694+07');
INSERT INTO public.page_contents VALUES ('customer_promo_badge', 'Member', '2026-06-19 18:32:01.857488+07');
INSERT INTO public.page_contents VALUES ('customer_promo_code', 'KDP15', '2026-06-19 18:32:12.7586+07');
INSERT INTO public.page_contents VALUES ('newsletter_title', 'Hãy đăng ký!', '2026-06-20 12:39:59.808687+07');
INSERT INTO public.page_contents VALUES ('newsletter_description', 'Nhận ngay thông báo về các đợt Sale off second hand giới hạn và ưu đãi dành riêng cho thành viên.', '2026-06-20 12:40:24.167675+07');
INSERT INTO public.page_contents VALUES ('newsletter_cta_url', '/login', '2026-06-20 12:40:32.277423+07');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.products VALUES (101, 13, 'Sofa da cao cấp Luxury - Premium Leather Sofa', 'sofa-da-cao-cap-luxury-premium-leather-sofa-101', 'FS-101', 23399740.00, NULL, 'Sofa chất liệu da bò Ý cao cấp, thiết kế hiện đại, khung gỗ sồi tự nhiên chống mối mọt. Mang lại vẻ sang trọng cho phòng khách của bạn.', 99, true, '["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-20 17:20:10.819936+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (93, 3, 'Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin', 'acer-sb220q-bi-215-inches-full-hd-1920-x-1080-ips-ultra-thin-13', 'FS-13', 15574000.00, NULL, '21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz - Using HDMI port Zero-frame design | ultra-thin | 4ms response time | IPS panel Aspect ratio - 16: 9. Color Supported - 16. 7 million colors. Brightness - 250 nit Tilt angle -5 degree to 15 degree. Horizontal viewing angle-178 degree. Vertical viewing angle-178 degree 75 hertz', 99, true, '["https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-20 17:20:10.819936+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (91, 3, 'Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5', 'silicon-power-256gb-ssd-3d-nand-a55-slc-cache-performance-boost-sata-iii-25-11', 'FS-11', 2834000.00, NULL, '3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance. The advanced SLC Cache Technology allows performance boost and longer lifespan 7mm slim design suitable for Ultrabooks and Ultra-slim notebooks. Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correction) to provide the optimized performance and enhanced reliability.', 99, true, '["https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-20 17:20:10.819936+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (121, 20, 'Giày fake loại 2', 'giay-fake-loai-2', 'GI-Y-FAKE--734', 399000.00, 300000.00, 'Giày nhái nai kè', 100, true, '["https://sneakerholicvietnam.vn/wp-content/uploads/2021/07/nike-air-force-1-low-white-315115-112.jpg"]', 'https://drive.google.com/file/d/1RI1m_AxWJYj1UMpjKQLTPqLbmH2_kiE3/view?usp=sharing', 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-21 10:22:40.955733+07', '2026-06-21 10:22:40.955733+07', 'Sale Off', 'Mới 90%', '2026-06-03 07:00:00+07', 389000.00);
INSERT INTO public.products VALUES (106, 13, 'Giường ngủ gỗ Walnut cao cấp - Walnut Queen Bed Frame', 'giuong-ngu-go-walnut-cao-cap-walnut-queen-bed-frame-106', 'FS-106', 20799740.00, NULL, 'Khung giường cỡ Queen làm từ gỗ óc chó (Walnut) tự nhiên, vân gỗ sang trọng độc bản, khả năng chịu lực vượt trội không rung lắc.', 98, true, '["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-20 17:35:25.932745+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (87, 2, 'White Gold Plated Princess', 'white-gold-plated-princess-7', 'FS-7', 259740.00, NULL, 'Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine''s Day...', 99, true, '["https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-20 17:20:10.819936+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (83, 1, 'Mens Cotton Jacket', 'mens-cotton-jacket-3', 'FS-3', 1455740.00, NULL, 'great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.', 100, true, '["https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-19 23:43:56.606911+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (81, 1, 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops', 'fjallraven-foldsack-no-1-backpack-fits-15-laptops-1', 'FS-1', 2858700.00, NULL, 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday', 100, true, '["https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (82, 1, 'Mens Casual Premium Slim Fit T-Shirts ', 'mens-casual-premium-slim-fit-t-shirts-2', 'FS-2', 579800.00, NULL, 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.', 100, true, '["https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (84, 1, 'Mens Casual Slim Fit', 'mens-casual-slim-fit-4', 'FS-4', 415740.00, NULL, 'The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.', 100, true, '["https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (85, 2, 'John Hardy Women''s Legends Naga Gold & Silver Dragon Station Chain Bracelet', 'john-hardy-womens-legends-naga-gold-silver-dragon-station-chain-bracelet-5', 'FS-5', 18070000.00, NULL, 'From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean''s pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.', 100, true, '["https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (86, 2, 'Solid Gold Petite Micropave ', 'solid-gold-petite-micropave-6', 'FS-6', 4368000.00, NULL, 'Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.', 100, true, '["https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (88, 2, 'Pierced Owl Rose Gold Plated Stainless Steel Double', 'pierced-owl-rose-gold-plated-stainless-steel-double-8', 'FS-8', 285740.00, NULL, 'Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel', 100, true, '["https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (89, 3, 'WD 2TB Elements Portable External Hard Drive - USB 3.0 ', 'wd-2tb-elements-portable-external-hard-drive-usb-30-9', 'FS-9', 1664000.00, NULL, 'USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system', 100, true, '["https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (111, 13, 'Ghế công thái học xoay văn phòng - Ergonomic Office Chair', 'ghe-cong-thai-hoc-xoay-van-phong-ergonomic-office-chair-111', 'FS-111', 4679740.00, NULL, 'Ghế ngồi làm việc lưới thoáng khí, hỗ trợ cột sống 3D chỉnh độ cao tựa đầu và tay vịn, giảm đau lưng khi làm việc lâu.', 100, true, '["https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (90, 3, 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s', 'sandisk-ssd-plus-1tb-internal-ssd-sata-iii-6-gbs-10', 'FS-10', 2834000.00, NULL, 'Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)', 100, true, '["https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (92, 3, 'WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive', 'wd-4tb-gaming-drive-works-with-playstation-4-portable-external-hard-drive-12', 'FS-12', 2964000.00, NULL, 'Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer''s limited warranty', 100, true, '["https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (94, 3, 'Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED ', 'samsung-49-inch-chg90-144hz-curved-gaming-monitor-lc49hg90dmnxza-super-ultrawide-screen-qled-14', 'FS-14', 25999740.00, NULL, '49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag', 100, true, '["https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (95, 4, 'BIYLACLESEN Women''s 3-in-1 Snowboard Jacket Winter Coats', 'biylaclesen-womens-3-in-1-snowboard-jacket-winter-coats-15', 'FS-15', 1481740.00, NULL, 'Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates', 100, true, '["https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (96, 4, 'Lock and Love Women''s Removable Hooded Faux Leather Moto Biker Jacket', 'lock-and-love-womens-removable-hooded-faux-leather-moto-biker-jacket-16', 'FS-16', 778700.00, NULL, '100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket, Button detail on waist / Detail stitching at sides, HAND WASH ONLY / DO NOT BLEACH / LINE DRY / DO NOT IRON', 100, true, '["https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (97, 4, 'Rain Jacket Women Windbreaker Striped Climbing Raincoats', 'rain-jacket-women-windbreaker-striped-climbing-raincoats-17', 'FS-17', 1039740.00, NULL, 'Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn''t overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.', 100, true, '["https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (98, 4, 'MBJ Women''s Solid Short Sleeve Boat Neck V ', 'mbj-womens-solid-short-sleeve-boat-neck-v-18', 'FS-18', 256100.00, NULL, '95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem', 100, true, '["https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (99, 4, 'Opna Women''s Short Sleeve Moisture', 'opna-womens-short-sleeve-moisture-19', 'FS-19', 206700.00, NULL, '100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort', 100, true, '["https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (100, 4, 'DANVOUY Womens T Shirt Casual Cotton Short', 'danvouy-womens-t-shirt-casual-cotton-short-20', 'FS-20', 337740.00, NULL, '95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.', 100, true, '["https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (102, 13, 'Sofa nỉ phong cách hiện đại - Modern Fabric Sofa', 'sofa-ni-phong-cach-hien-ai-modern-fabric-sofa-102', 'FS-102', 12999740.00, NULL, 'Sofa nỉ màu xám trung tính, đệm bông ép đàn hồi cao, thiết kế tối giản phù hợp cho căn hộ chung cư hoặc phòng khách nhỏ gọn.', 100, true, '["https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (104, 13, 'Ghế thư giãn gỗ bọc nệm - Wooden Lounge Chair', 'ghe-thu-gian-go-boc-nem-wooden-lounge-chair-104', 'FS-104', 3899740.00, NULL, 'Ghế bành thư giãn phong cách Bắc Âu, khung gỗ tần bì chắc chắn kết hợp nệm bọc vải canvas mềm mại, thoáng mát.', 100, true, '["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (105, 13, 'Tủ sách gỗ Minimalist - Minimalist Wooden Bookshelf', 'tu-sach-go-minimalist-minimalist-wooden-bookshelf-105', 'FS-105', 6499740.00, NULL, 'Kệ sách nhiều tầng bằng gỗ công nghiệp phủ melamine chống xước, thiết kế thông thoáng giúp trang trí và lưu trữ sách gọn gàng.', 100, true, '["https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (107, 13, 'Đèn sàn Bắc Âu ấm áp - Nordic Floor Lamp', 'en-san-bac-au-am-ap-nordic-floor-lamp-107', 'FS-107', 2079740.00, NULL, 'Đèn đứng trang trí phòng khách hoặc phòng đọc sách, khung thép sơn tĩnh điện đen bóng kết hợp chao đèn vải khuếch tán ánh sáng ấm áp.', 100, true, '["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (108, 13, 'Bàn ăn mặt đá cẩm thạch - Marble Dining Table', 'ban-an-mat-a-cam-thach-marble-dining-table-108', 'FS-108', 18199740.00, NULL, 'Bàn ăn sang trọng dành cho 6 người, mặt đá cẩm thạch trắng nhân tạo chống ố, chống xước cùng chân kim loại mạ vàng.', 100, true, '["https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (109, 13, 'Ghế ăn bọc da chân sắt - Leather Dining Chair', 'ghe-an-boc-da-chan-sat-leather-dining-chair-109', 'FS-109', 2339740.00, NULL, 'Ghế ăn bọc da PU cao cấp chống nước, đệm mút siêu êm, chân sắt sơn tĩnh điện chống rỉ sét sét chịu tải đến 150kg.', 100, true, '["https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (110, 13, 'Kệ tivi thông minh gỗ sồi - Smart Oak TV Stand', 'ke-tivi-thong-minh-go-soi-smart-oak-tv-stand-110', 'FS-110', 9099740.00, NULL, 'Kệ tivi thiết kế rút gọn thông minh điều chỉnh chiều dài từ 1.8m đến 2.4m, trang bị nhiều hộc kéo lưu trữ đồ dùng phòng khách.', 100, true, '["https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (103, 13, 'Bàn trà gỗ sồi tự nhiên - Oak Coffee Table', 'ban-tra-go-soi-tu-nhien-oak-coffee-table-103', 'FS-103', 5199740.00, NULL, 'Bàn trà chế tác từ gỗ sồi tự nhiên nhập khẩu, phủ sơn PU chống thấm nước, tích hợp ngăn kéo đựng đồ tiện dụng.', 98, true, '["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-20 17:35:25.932745+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (112, 13, 'Bàn làm việc nâng hạ thông minh - Smart Standing Desk', 'ban-lam-viec-nang-ha-thong-minh-smart-standing-desk-112', 'FS-112', 10399740.00, NULL, 'Bàn làm việc thay đổi chiều cao tự động bằng động cơ điện đôi, ghi nhớ 4 vị trí, mặt bàn gỗ tự nhiên phủ melamine.', 100, true, '["https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (114, 13, 'Gương đứng soi toàn thân viền gỗ - Full Length Mirror', 'guong-ung-soi-toan-than-vien-go-full-length-mirror-114', 'FS-114', 2599740.00, NULL, 'Gương soi toàn thân chất liệu kính tráng bạc sắc nét, viền gỗ thông tự nhiên sơn sồi mộc mạc, làm đẹp và tạo cảm giác rộng rãi cho phòng ngủ.', 100, true, '["https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (115, 13, 'Thảm trải sàn Boho thổ cẩm - Boho Area Rug', 'tham-trai-san-boho-tho-cam-boho-area-rug-115', 'FS-115', 1559740.00, NULL, 'Thảm dệt thổ cẩm sợi cotton tự nhiên thân thiện da chân, họa tiết Boho độc đáo thích hợp làm điểm nhấn phòng khách hay phòng ngủ.', 100, true, '["https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (116, 13, 'Ghế sofa đơn thư giãn - Single Sofa Accent Chair', 'ghe-sofa-on-thu-gian-single-sofa-accent-chair-116', 'FS-116', 4939740.00, NULL, 'Ghế bành sofa đơn bọc vải nhung êm ái chân kim loại mạ vàng sang trọng, tạo góc thư giãn đọc sách lý tưởng.', 100, true, '["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (118, 13, 'Kệ giày thông minh đa năng - Smart Shoe Rack Cabinet', 'ke-giay-thong-minh-a-nang-smart-shoe-rack-cabinet-118', 'FS-118', 3119740.00, NULL, 'Kệ giày cánh lật siêu mỏng tiết kiệm diện tích lối ra vào, sức chứa lên đến 20 đôi giày kèm ngăn trên cùng để chìa khóa ví tiền.', 100, true, '["https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (119, 13, 'Ghế quầy bar gỗ tần bì - Ash Wooden Bar Stool', 'ghe-quay-bar-go-tan-bi-ash-wooden-bar-stool-119', 'FS-119', 1819740.00, NULL, 'Ghế quầy bar chân cao làm từ gỗ tần bì tự nhiên, đệm ngồi hơi cong công thái học mang lại tư thế thoải mái khi thưởng thức đồ uống.', 100, true, '["https://images.unsplash.com/photo-1579725942955-4d8377f8c66a?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (120, 13, 'Tủ 5 ngăn kéo gỗ sồi cao cấp - Oak 5-Drawer Chest', 'tu-5-ngan-keo-go-soi-cao-cap-oak-5-drawer-chest-120', 'FS-120', 8319740.00, NULL, 'Tủ ngăn kéo lưu trữ đồ gấp gọn trong phòng ngủ, kết cấu mộng gỗ truyền thống bền chắc, tay nắm âm sang trọng và an toàn.', 100, true, '["https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-17 08:06:29.416323+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (113, 13, 'Tủ quần áo âm tường hiện đại - Modern Built-in Wardrobe', 'tu-quan-ao-am-tuong-hien-ai-modern-built-in-wardrobe', 'FS-113', 15599740.00, NULL, 'Tủ áo thiết kế cao kịch trần, cánh lùa tiết kiệm không gian, nhiều ngăn treo đồ và ngăn kéo để trang sức phụ kiện gọn gàng.', 100, true, '["https://gotrangtri.vn/wp-content/uploads/2025/12/Tu-quan-ao-phong-cach-toi-gian-hien-dai-GHS-55123.png"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-20 12:21:39.404766+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);
INSERT INTO public.products VALUES (117, 13, 'Bàn trang điểm đèn LED hiện đại - Dressing Table with LED', 'ban-trang-iem-en-led-hien-ai-dressing-table-with-led-117', 'FS-117', 7279740.00, NULL, 'Bàn trang điểm nhỏ gọn viền vàng kim, tích hợp gương soi bo tròn có dải đèn LED cảm ứng 3 chế độ sáng và tủ tab 3 ngăn kéo.', 99, true, '["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80"]', NULL, 1, 1, 1, 0, 0, 0, '{"colors": [], "textures": []}', '{"beta": 1, "alpha": 0, "radius": 5}', '2026-06-17 08:06:29.416323+07', '2026-06-20 17:20:10.819936+07', NULL, 'Mới 95%', '2026-06-20 16:33:54.557698+07', NULL);


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: static_pages; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.static_pages VALUES (1, 'doi-tra-de-dang', 'Đổi Trả Dễ Dàng', '<h2>Chính Sách Đổi Trả Sản Phẩm Secondhand tại KDP Store</h2>
            <p>Nhằm đảm bảo trải nghiệm mua sắm tuyệt vời nhất, chúng tôi áp dụng chính sách đổi trả linh hoạt:</p>
            <ul>
              <li><strong>Thời gian:</strong> Hỗ trợ đổi trả trong vòng 3 ngày kể từ ngày nhận hàng.</li>
              <li><strong>Điều kiện:</strong> Sản phẩm còn nguyên tag, chưa qua sử dụng thêm và đúng với hiện trạng lúc cửa hàng giao.</li>
              <li><strong>Chi phí:</strong> Miễn phí đổi hàng nếu lỗi thuộc về mô tả sai của cửa hàng. Các lý do chủ quan khác sẽ tính phí ship 2 chiều.</li>
            </ul>', 'service', '2026-06-20 16:45:47.970114+07', '2026-06-20 16:45:47.970114+07');
INSERT INTO public.static_pages VALUES (2, 'bao-hanh-san-pham', 'Bảo Hành Sản Phẩm', '<h2>Chính Sách Bảo Hành & Bảo Dưỡng Đồ Secondhand</h2>
            <p>KDP Store cam kết đồng hành lâu dài cùng sản phẩm của bạn:</p>
            <ul>
              <li><strong>Quần áo/Phụ kiện:</strong> Hỗ trợ sửa khoá, đính nút hoặc sửa đường chỉ miễn phí trong 1 tháng đầu.</li>
              <li><strong>Đồ nội thất 3D/Vật phẩm cao cấp:</strong> Bảo hành kết cấu từ 3 đến 6 tháng tuỳ tình trạng sản phẩm lúc mua.</li>
              <li><strong>Bảo dưỡng:</strong> Dịch vụ giặt khô/vệ sinh giày với giá ưu đãi cực sâu dành riêng cho thành viên Z-CLUB.</li>
            </ul>', 'service', '2026-06-20 16:45:47.974603+07', '2026-06-20 16:45:47.974603+07');
INSERT INTO public.static_pages VALUES (3, 'membership-perks', 'Membership Perks', '<h2>Đặc Quyền Thành Viên Z-CLUB</h2>
            <p>Tham gia cộng đồng thời trang bền vững và nhận ngập tràn đặc quyền:</p>
            <ul>
              <li>Tích điểm 5% giá trị mỗi đơn hàng, quy đổi trực tiếp thành voucher giảm giá.</li>
              <li>Ưu tiên đặt trước (Pre-order) các bộ sưu tập drop secondhand giới hạn.</li>
              <li>Miễn phí vận chuyển cho toàn bộ hoá đơn từ 500k.</li>
            </ul>', 'service', '2026-06-20 16:45:47.976331+07', '2026-06-20 16:45:47.976331+07');
INSERT INTO public.static_pages VALUES (4, 've-kdp-store', 'Về KDP Store', '<h2>KDP Store - Thời Trang Tái Sinh & Sống Xanh</h2>
            <p>KDP Store được thành lập năm 2026 với tầm nhìn cách mạng hoá thời trang secondhand tại Việt Nam. Chúng tôi tin rằng mỗi món đồ cũ đều mang một câu chuyện độc bản cần được kể tiếp.</p>
            <p>Bằng việc tích hợp công nghệ trình chiếu 3D tương tác, khách hàng có thể kiểm tra từng đường kim mũi chỉ và góc cạnh sản phẩm một cách chân thực nhất trước khi quyết định sở hữu.</p>', 'explore', '2026-06-20 16:45:47.97754+07', '2026-06-20 16:45:47.97754+07');
INSERT INTO public.static_pages VALUES (5, 'lookbook-2026', 'Lookbook 2026', '<h2>Lookbook 2026 // Retro & Y2K Aesthetics</h2>
            <p>Chiêm ngưỡng những set đồ secondhand mang đậm dấu ấn thời gian được tuyển chọn và mix-match bởi Z Studio. Cảm hứng giao thoa giữa phong cách đường phố Retro thập niên 90 và hơi thở vị lai Y2K.</p>
            <p>Các sản phẩm xuất hiện trong Lookbook hiện đang được bày bán độc quyền tại cửa hàng KDP Store.</p>', 'explore', '2026-06-20 16:45:47.978834+07', '2026-06-20 16:45:47.978834+07');
INSERT INTO public.static_pages VALUES (6, 'chinh-sach-xanh', 'Chính Sách Xanh', '<h2>Cam Kết Bảo Vệ Môi Trường</h2>
            <p>Mỗi giao dịch tại KDP Store góp phần giảm thiểu rác thải dệt may ra môi trường:</p>
            <ul>
              <li>100% bao bì sử dụng giấy tái chế thân thiện môi trường.</li>
              <li>Khuyến khích khách hàng quyên góp quần áo cũ để nhận ưu đãi mua sắm mới.</li>
              <li>Trích lập quỹ trồng rừng ngập mặn Việt Nam từ 1% doanh thu mỗi đơn hàng bán ra.</li>
            </ul>', 'explore', '2026-06-20 16:45:47.980283+07', '2026-06-20 16:45:47.980283+07');


--
-- Data for Name: user_identities; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES ('fa4a109b-0e7f-43c0-a4c5-b451a7f887cb', 'user@gmail.com', '$2b$10$XnPluQA8hJT1vsL54/Pw/uN6QRr1AAe131SmlXgy0xPmmgd0NC8wy', 'khoa', '0950348313', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix', 'customer', true, '[{"name": "khoa", "phone": "0950348313", "address": "123123, bt, tphcm", "is_default": true}]', '2026-06-18 09:39:36.53225+07', '2026-06-20 17:41:57.644506+07');
INSERT INTO public.users VALUES ('2d186e9a-193d-49a6-9ce6-10825f8ff395', 'admin@gmail.com', '$2b$10$EBX6tetv74P.aonm9ZwMQe86xwJYHI7M1bHptQRfASe5o5fsqOaa2', 'admin', '664534234365', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka', 'admin', true, '[]', '2026-06-17 08:47:41.884536+07', '2026-06-21 07:42:13.530934+07');


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 20, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 121, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: static_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.static_pages_id_seq', 6, true);


--
-- Name: user_identities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_identities_id_seq', 1, false);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: carts carts_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_key UNIQUE (user_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: page_contents page_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_contents
    ADD CONSTRAINT page_contents_pkey PRIMARY KEY (key);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);


--
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_key UNIQUE (slug);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: static_pages static_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.static_pages
    ADD CONSTRAINT static_pages_pkey PRIMARY KEY (id);


--
-- Name: static_pages static_pages_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.static_pages
    ADD CONSTRAINT static_pages_slug_key UNIQUE (slug);


--
-- Name: user_identities user_identities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_identities
    ADD CONSTRAINT user_identities_pkey PRIMARY KEY (id);


--
-- Name: user_identities user_identities_provider_provider_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_identities
    ADD CONSTRAINT user_identities_provider_provider_id_key UNIQUE (provider, provider_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_orders_items; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_items ON public.orders USING gin (items);


--
-- Name: idx_products_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_category ON public.products USING btree (category_id);


--
-- Name: idx_products_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_slug ON public.products USING btree (slug);


--
-- Name: idx_reviews_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_product ON public.reviews USING btree (product_id);


--
-- Name: idx_user_identities_provider; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_identities_provider ON public.user_identities USING btree (provider, provider_id);


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: user_identities user_identities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_identities
    ADD CONSTRAINT user_identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

