
```
DoAnUxUi
├─ backup.sql
├─ client
│  ├─ .env
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ Auth.md
│  │  │  ├─ layout.tsx
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  └─ register
│  │  │     └─ page.tsx
│  │  ├─ (public)
│  │  │  ├─ categories
│  │  │  │  └─ [slug]
│  │  │  │     └─ page.tsx
│  │  │  ├─ explore-services
│  │  │  │  └─ [slug]
│  │  │  │     └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ payment-success
│  │  │  │  └─ page.tsx
│  │  │  └─ products
│  │  │     └─ [slug]
│  │  │        ├─ CheckoutModal.tsx
│  │  │        ├─ page.tsx
│  │  │        ├─ ProductDetails.tsx
│  │  │        ├─ ProductEditForm.tsx
│  │  │        └─ ProductMediaViewer.tsx
│  │  ├─ dashboard
│  │  │  ├─ admin
│  │  │  │  ├─ admins
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ categories
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ customers
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ orders
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page-contents
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ products
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ profile
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ static-pages
│  │  │  │     └─ page.tsx
│  │  │  ├─ customer
│  │  │  │  ├─ orders
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ profile
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ wishlist
│  │  │  │     └─ page.tsx
│  │  │  ├─ Dashbaord.md
│  │  │  └─ layout.tsx
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ not-found.tsx
│  ├─ components
│  │  ├─ common
│  │  │  └─ RichTextEditor.tsx
│  │  ├─ layouts
│  │  │  ├─ (dashboard)
│  │  │  │  ├─ config.tsx
│  │  │  │  ├─ DashboardSetup.tsx
│  │  │  │  ├─ dashboeard.md
│  │  │  │  ├─ Footer
│  │  │  │  │  └─ DashboardFooter.tsx
│  │  │  │  ├─ Navbar
│  │  │  │  │  └─ DashboardNavbar.tsx
│  │  │  │  └─ Sidebar
│  │  │  │     └─ DashboardSidebar.tsx
│  │  │  ├─ (public)
│  │  │  │  ├─ CartDrawer.tsx
│  │  │  │  ├─ EditableText.tsx
│  │  │  │  ├─ Footer
│  │  │  │  │  └─ PublicFooter.tsx
│  │  │  │  ├─ Navbar
│  │  │  │  │  └─ PublicNavbar.tsx
│  │  │  │  └─ PublicSetup.tsx
│  │  │  └─ @base
│  │  │     ├─ Footer
│  │  │     │  └─ BaseFooter.tsx
│  │  │     └─ Navbar
│  │  │        └─ BaseNavbar.tsx
│  │  └─ pages
│  │     ├─ admin
│  │     │  ├─ AdminDeleteModal.tsx
│  │     │  ├─ AdminPagination.tsx
│  │     │  └─ helpers.ts
│  │     ├─ AdminAdmins
│  │     │  ├─ AdminsHeader.tsx
│  │     │  ├─ AdminsTable.tsx
│  │     │  ├─ AdminStatsCards.tsx
│  │     │  └─ Index.tsx
│  │     ├─ AdminCategories
│  │     │  ├─ CategoriesHeader.tsx
│  │     │  ├─ CategoryModal.tsx
│  │     │  ├─ CategoryStats.tsx
│  │     │  ├─ CategoryTreeRow.tsx
│  │     │  ├─ CategoryTreeTable.tsx
│  │     │  ├─ DeleteConfirmModal.tsx
│  │     │  ├─ helpers.ts
│  │     │  ├─ Index.tsx
│  │     │  └─ types.ts
│  │     ├─ AdminCustomers
│  │     │  ├─ CustomerModal.tsx
│  │     │  ├─ CustomersHeader.tsx
│  │     │  ├─ CustomersTable.tsx
│  │     │  ├─ CustomerStatsCards.tsx
│  │     │  └─ Index.tsx
│  │     ├─ AdminDashboard
│  │     │  ├─ AnimatedStat.tsx
│  │     │  ├─ DashboardHeader.tsx
│  │     │  ├─ helpers.ts
│  │     │  ├─ Index.tsx
│  │     │  ├─ RecentOrdersTable.tsx
│  │     │  ├─ types.ts
│  │     │  └─ useDashboardStats.ts
│  │     ├─ AdminOrders
│  │     │  ├─ CreateOrderModal.tsx
│  │     │  ├─ DeleteOrderModal.tsx
│  │     │  ├─ EditOrderModal.tsx
│  │     │  ├─ Index.tsx
│  │     │  ├─ OrdersHeader.tsx
│  │     │  ├─ OrdersTable.tsx
│  │     │  └─ OrderStatsCards.tsx
│  │     ├─ AdminProducts
│  │     │  ├─ Index.tsx
│  │     │  ├─ ProductsHeader.tsx
│  │     │  ├─ ProductsTable.tsx
│  │     │  └─ ProductStatsCards.tsx
│  │     ├─ auth
│  │     │  ├─ AuthCard.tsx
│  │     │  ├─ AuthErrorAlert.tsx
│  │     │  ├─ AuthFooterLink.tsx
│  │     │  └─ SocialLoginSection.tsx
│  │     ├─ CustomerDashboard
│  │     │  ├─ AccountQuickLinks.tsx
│  │     │  ├─ CustomerStatsRow.tsx
│  │     │  ├─ helpers.ts
│  │     │  ├─ Index.tsx
│  │     │  ├─ OrderCard.tsx
│  │     │  ├─ PromoBanner.tsx
│  │     │  ├─ RecentOrdersList.tsx
│  │     │  ├─ StatBadge.tsx
│  │     │  └─ WelcomeBanner.tsx
│  │     ├─ LoginPage
│  │     │  ├─ Index.tsx
│  │     │  └─ LoginForm.tsx
│  │     ├─ MainPage
│  │     │  ├─ AdminQuickActions.tsx
│  │     │  ├─ BabylonViewer.tsx
│  │     │  ├─ FeaturedCollections.tsx
│  │     │  ├─ Hero.tsx
│  │     │  ├─ Index.tsx
│  │     │  ├─ Newsletter.tsx
│  │     │  ├─ ProductCard.tsx
│  │     │  ├─ ProductCatalog.tsx
│  │     │  ├─ ProductDetailModal.tsx
│  │     │  ├─ ProductFilterBar.tsx
│  │     │  ├─ ProductListContent.tsx
│  │     │  ├─ ProductModal.tsx
│  │     │  └─ useMainPage.ts
│  │     └─ RegisterPage
│  │        ├─ Index.tsx
│  │        └─ RegisterForm.tsx
│  ├─ constants
│  │  └─ constants.md
│  ├─ contexts
│  │  ├─ AuthContext.tsx
│  │  ├─ CartContext.tsx
│  │  └─ PageContentContext.tsx
│  ├─ eslint.config.mjs
│  ├─ hooks
│  │  ├─ hooks.md
│  │  ├─ useAdminStats.ts
│  │  ├─ useCategories.ts
│  │  ├─ useOrders.ts
│  │  ├─ useProducts.ts
│  │  └─ useUsers.ts
│  ├─ libs
│  │  └─ libs.md
│  ├─ middlewares
│  │  └─ middlewares.md
│  ├─ next-env.d.ts
│  ├─ next.config.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.mjs
│  ├─ proxy.ts
│  ├─ public
│  │  └─ img
│  │     └─ img.md
│  ├─ README.md
│  ├─ services
│  │  └─ services.md
│  ├─ store
│  │  └─ store.md
│  ├─ tsconfig.json
│  ├─ tsconfig.tsbuildinfo
│  ├─ types
│  │  ├─ api.ts
│  │  ├─ babylon.d.ts
│  │  └─ types.md
│  └─ utils
│     ├─ fetchWithTimeout.ts
│     ├─ formatModelUrl.ts
│     └─ utils.md
└─ server
   ├─ .env
   ├─ .env.example
   ├─ .prettierrc
   ├─ dist
   │  └─ src
   │     ├─ @types
   │     │  ├─ index.d.js
   │     │  └─ index.d.js.map
   │     ├─ app.controller.js
   │     ├─ app.controller.js.map
   │     ├─ app.controller.spec.js
   │     ├─ app.controller.spec.js.map
   │     ├─ app.module.js
   │     ├─ app.module.js.map
   │     ├─ app.service.js
   │     ├─ app.service.js.map
   │     ├─ common
   │     │  └─ guards
   │     │     ├─ jwt-auth.guard.js
   │     │     ├─ jwt-auth.guard.js.map
   │     │     ├─ roles.guard.js
   │     │     └─ roles.guard.js.map
   │     ├─ config
   │     │  ├─ app.config.js
   │     │  ├─ app.config.js.map
   │     │  ├─ env.config.js
   │     │  └─ env.config.js.map
   │     ├─ constants
   │     │  ├─ app.constant.js
   │     │  └─ app.constant.js.map
   │     ├─ database
   │     │  ├─ database.module.js
   │     │  ├─ database.module.js.map
   │     │  ├─ pg.provider.js
   │     │  └─ pg.provider.js.map
   │     ├─ main.js
   │     ├─ main.js.map
   │     ├─ modules
   │     │  ├─ auth
   │     │  │  ├─ auth.controller.js
   │     │  │  ├─ auth.controller.js.map
   │     │  │  ├─ auth.module.js
   │     │  │  ├─ auth.module.js.map
   │     │  │  ├─ auth.service.js
   │     │  │  ├─ auth.service.js.map
   │     │  │  └─ dto
   │     │  │     ├─ auth.dto.js
   │     │  │     └─ auth.dto.js.map
   │     │  ├─ carts
   │     │  │  ├─ carts.controller.js
   │     │  │  ├─ carts.controller.js.map
   │     │  │  ├─ carts.module.js
   │     │  │  ├─ carts.module.js.map
   │     │  │  ├─ carts.service.js
   │     │  │  ├─ carts.service.js.map
   │     │  │  ├─ dto
   │     │  │  │  ├─ cart-response.dto.js
   │     │  │  │  ├─ cart-response.dto.js.map
   │     │  │  │  ├─ create-cart.dto.js
   │     │  │  │  ├─ create-cart.dto.js.map
   │     │  │  │  ├─ query-cart.dto.js
   │     │  │  │  ├─ query-cart.dto.js.map
   │     │  │  │  ├─ update-cart.dto.js
   │     │  │  │  └─ update-cart.dto.js.map
   │     │  │  └─ entities
   │     │  │     ├─ cart.entity.js
   │     │  │     └─ cart.entity.js.map
   │     │  ├─ categories
   │     │  │  ├─ categories.controller.js
   │     │  │  ├─ categories.controller.js.map
   │     │  │  ├─ categories.module.js
   │     │  │  ├─ categories.module.js.map
   │     │  │  ├─ categories.service.js
   │     │  │  ├─ categories.service.js.map
   │     │  │  ├─ dto
   │     │  │  │  ├─ category-response.dto.js
   │     │  │  │  ├─ category-response.dto.js.map
   │     │  │  │  ├─ create-category.dto.js
   │     │  │  │  ├─ create-category.dto.js.map
   │     │  │  │  ├─ query-category.dto.js
   │     │  │  │  ├─ query-category.dto.js.map
   │     │  │  │  ├─ update-category.dto.js
   │     │  │  │  └─ update-category.dto.js.map
   │     │  │  └─ entities
   │     │  │     ├─ category.entity.js
   │     │  │     └─ category.entity.js.map
   │     │  ├─ orders
   │     │  │  ├─ dto
   │     │  │  │  ├─ create-order.dto.js
   │     │  │  │  ├─ create-order.dto.js.map
   │     │  │  │  ├─ order-response.dto.js
   │     │  │  │  ├─ order-response.dto.js.map
   │     │  │  │  ├─ query-order.dto.js
   │     │  │  │  ├─ query-order.dto.js.map
   │     │  │  │  ├─ update-order.dto.js
   │     │  │  │  └─ update-order.dto.js.map
   │     │  │  ├─ entities
   │     │  │  │  ├─ order.entity.js
   │     │  │  │  └─ order.entity.js.map
   │     │  │  ├─ orders.controller.js
   │     │  │  ├─ orders.controller.js.map
   │     │  │  ├─ orders.module.js
   │     │  │  ├─ orders.module.js.map
   │     │  │  ├─ orders.service.js
   │     │  │  └─ orders.service.js.map
   │     │  ├─ page-contents
   │     │  │  ├─ dto
   │     │  │  │  ├─ create-page-content.dto.js
   │     │  │  │  ├─ create-page-content.dto.js.map
   │     │  │  │  ├─ update-page-content.dto.js
   │     │  │  │  └─ update-page-content.dto.js.map
   │     │  │  ├─ entities
   │     │  │  │  ├─ page-content.entity.js
   │     │  │  │  └─ page-content.entity.js.map
   │     │  │  ├─ page-contents.controller.js
   │     │  │  ├─ page-contents.controller.js.map
   │     │  │  ├─ page-contents.module.js
   │     │  │  ├─ page-contents.module.js.map
   │     │  │  ├─ page-contents.service.js
   │     │  │  └─ page-contents.service.js.map
   │     │  ├─ products
   │     │  │  ├─ dto
   │     │  │  │  ├─ create-product.dto.js
   │     │  │  │  ├─ create-product.dto.js.map
   │     │  │  │  ├─ product-response.dto.js
   │     │  │  │  ├─ product-response.dto.js.map
   │     │  │  │  ├─ query-product.dto.js
   │     │  │  │  ├─ query-product.dto.js.map
   │     │  │  │  ├─ update-product.dto.js
   │     │  │  │  └─ update-product.dto.js.map
   │     │  │  ├─ entities
   │     │  │  │  ├─ product.entity.js
   │     │  │  │  └─ product.entity.js.map
   │     │  │  ├─ products.controller.js
   │     │  │  ├─ products.controller.js.map
   │     │  │  ├─ products.module.js
   │     │  │  ├─ products.module.js.map
   │     │  │  ├─ products.service.js
   │     │  │  └─ products.service.js.map
   │     │  ├─ reviews
   │     │  │  ├─ dto
   │     │  │  │  ├─ create-review.dto.js
   │     │  │  │  ├─ create-review.dto.js.map
   │     │  │  │  ├─ query-review.dto.js
   │     │  │  │  ├─ query-review.dto.js.map
   │     │  │  │  ├─ review-response.dto.js
   │     │  │  │  ├─ review-response.dto.js.map
   │     │  │  │  ├─ update-review.dto.js
   │     │  │  │  └─ update-review.dto.js.map
   │     │  │  ├─ entities
   │     │  │  │  ├─ review.entity.js
   │     │  │  │  └─ review.entity.js.map
   │     │  │  ├─ reviews.controller.js
   │     │  │  ├─ reviews.controller.js.map
   │     │  │  ├─ reviews.module.js
   │     │  │  ├─ reviews.module.js.map
   │     │  │  ├─ reviews.service.js
   │     │  │  └─ reviews.service.js.map
   │     │  ├─ static-pages
   │     │  │  ├─ dto
   │     │  │  │  ├─ create-static-page.dto.js
   │     │  │  │  ├─ create-static-page.dto.js.map
   │     │  │  │  ├─ update-static-page.dto.js
   │     │  │  │  └─ update-static-page.dto.js.map
   │     │  │  ├─ entities
   │     │  │  │  ├─ static-page.entity.js
   │     │  │  │  └─ static-page.entity.js.map
   │     │  │  ├─ static-pages.controller.js
   │     │  │  ├─ static-pages.controller.js.map
   │     │  │  ├─ static-pages.module.js
   │     │  │  ├─ static-pages.module.js.map
   │     │  │  ├─ static-pages.service.js
   │     │  │  └─ static-pages.service.js.map
   │     │  ├─ user-identities
   │     │  │  ├─ dto
   │     │  │  │  ├─ create-user-identity.dto.js
   │     │  │  │  ├─ create-user-identity.dto.js.map
   │     │  │  │  ├─ query-user-identity.dto.js
   │     │  │  │  ├─ query-user-identity.dto.js.map
   │     │  │  │  ├─ update-user-identity.dto.js
   │     │  │  │  ├─ update-user-identity.dto.js.map
   │     │  │  │  ├─ user-identity-response.dto.js
   │     │  │  │  └─ user-identity-response.dto.js.map
   │     │  │  ├─ entities
   │     │  │  │  ├─ user-identity.entity.js
   │     │  │  │  └─ user-identity.entity.js.map
   │     │  │  ├─ user-identities.controller.js
   │     │  │  ├─ user-identities.controller.js.map
   │     │  │  ├─ user-identities.module.js
   │     │  │  ├─ user-identities.module.js.map
   │     │  │  ├─ user-identities.service.js
   │     │  │  └─ user-identities.service.js.map
   │     │  └─ users
   │     │     ├─ dto
   │     │     │  ├─ create-user.dto.js
   │     │     │  ├─ create-user.dto.js.map
   │     │     │  ├─ query-user.dto.js
   │     │     │  ├─ query-user.dto.js.map
   │     │     │  ├─ update-user.dto.js
   │     │     │  ├─ update-user.dto.js.map
   │     │     │  ├─ user-response.dto.js
   │     │     │  └─ user-response.dto.js.map
   │     │     ├─ entities
   │     │     │  ├─ user.entity.js
   │     │     │  └─ user.entity.js.map
   │     │     ├─ users.controller.js
   │     │     ├─ users.controller.js.map
   │     │     ├─ users.module.js
   │     │     ├─ users.module.js.map
   │     │     ├─ users.service.js
   │     │     └─ users.service.js.map
   │     ├─ swagger
   │     │  ├─ swagger.config.js
   │     │  └─ swagger.config.js.map
   │     ├─ utils
   │     │  ├─ response.util.js
   │     │  └─ response.util.js.map
   │     └─ validators
   │        ├─ uuid.validator.js
   │        └─ uuid.validator.js.map
   ├─ eslint.config.mjs
   ├─ nest-cli.json
   ├─ package-lock.json
   ├─ package.json
   ├─ scripts
   │  └─ kill-port.js
   ├─ server.md
   ├─ src
   │  ├─ @types
   │  │  ├─ @types.md
   │  │  └─ index.d.ts
   │  ├─ app.controller.spec.ts
   │  ├─ app.controller.ts
   │  ├─ app.module.ts
   │  ├─ app.service.ts
   │  ├─ common
   │  │  ├─ common.md
   │  │  ├─ filters
   │  │  │  └─ filters.md
   │  │  ├─ guards
   │  │  │  ├─ guards.md
   │  │  │  ├─ jwt-auth.guard.ts
   │  │  │  └─ roles.guard.ts
   │  │  ├─ interceptors
   │  │  │  └─ interceptors.md
   │  │  ├─ middlewares
   │  │  │  └─ middlewares.md
   │  │  └─ pipes
   │  │     └─ pipes.md
   │  ├─ config
   │  │  ├─ app.config.ts
   │  │  ├─ config.md
   │  │  └─ env.config.ts
   │  ├─ constants
   │  │  ├─ app.constant.ts
   │  │  └─ constants.md
   │  ├─ database
   │  │  ├─ database.md
   │  │  ├─ database.module.ts
   │  │  ├─ pg.provider.ts
   │  │  └─ scripts
   │  │     └─ KDP_Store_DB.sql
   │  ├─ main.ts
   │  ├─ modules
   │  │  ├─ auth
   │  │  │  ├─ auth.controller.ts
   │  │  │  ├─ auth.module.ts
   │  │  │  ├─ auth.service.ts
   │  │  │  └─ dto
   │  │  │     └─ auth.dto.ts
   │  │  ├─ carts
   │  │  │  ├─ carts.controller.ts
   │  │  │  ├─ carts.module.ts
   │  │  │  ├─ carts.service.ts
   │  │  │  ├─ dto
   │  │  │  │  ├─ cart-response.dto.ts
   │  │  │  │  ├─ create-cart.dto.ts
   │  │  │  │  ├─ query-cart.dto.ts
   │  │  │  │  └─ update-cart.dto.ts
   │  │  │  └─ entities
   │  │  │     └─ cart.entity.ts
   │  │  ├─ categories
   │  │  │  ├─ categories.controller.ts
   │  │  │  ├─ categories.module.ts
   │  │  │  ├─ categories.service.ts
   │  │  │  ├─ dto
   │  │  │  │  ├─ category-response.dto.ts
   │  │  │  │  ├─ create-category.dto.ts
   │  │  │  │  ├─ query-category.dto.ts
   │  │  │  │  └─ update-category.dto.ts
   │  │  │  └─ entities
   │  │  │     └─ category.entity.ts
   │  │  ├─ modules.md
   │  │  ├─ orders
   │  │  │  ├─ dto
   │  │  │  │  ├─ create-order.dto.ts
   │  │  │  │  ├─ order-response.dto.ts
   │  │  │  │  ├─ query-order.dto.ts
   │  │  │  │  └─ update-order.dto.ts
   │  │  │  ├─ entities
   │  │  │  │  └─ order.entity.ts
   │  │  │  ├─ orders.controller.ts
   │  │  │  ├─ orders.module.ts
   │  │  │  └─ orders.service.ts
   │  │  ├─ page-contents
   │  │  │  ├─ dto
   │  │  │  │  ├─ create-page-content.dto.ts
   │  │  │  │  └─ update-page-content.dto.ts
   │  │  │  ├─ entities
   │  │  │  │  └─ page-content.entity.ts
   │  │  │  ├─ page-contents.controller.ts
   │  │  │  ├─ page-contents.module.ts
   │  │  │  └─ page-contents.service.ts
   │  │  ├─ products
   │  │  │  ├─ dto
   │  │  │  │  ├─ create-product.dto.ts
   │  │  │  │  ├─ product-response.dto.ts
   │  │  │  │  ├─ query-product.dto.ts
   │  │  │  │  └─ update-product.dto.ts
   │  │  │  ├─ entities
   │  │  │  │  └─ product.entity.ts
   │  │  │  ├─ products.controller.ts
   │  │  │  ├─ products.module.ts
   │  │  │  └─ products.service.ts
   │  │  ├─ reviews
   │  │  │  ├─ dto
   │  │  │  │  ├─ create-review.dto.ts
   │  │  │  │  ├─ query-review.dto.ts
   │  │  │  │  ├─ review-response.dto.ts
   │  │  │  │  └─ update-review.dto.ts
   │  │  │  ├─ entities
   │  │  │  │  └─ review.entity.ts
   │  │  │  ├─ reviews.controller.ts
   │  │  │  ├─ reviews.module.ts
   │  │  │  └─ reviews.service.ts
   │  │  ├─ static-pages
   │  │  │  ├─ dto
   │  │  │  │  ├─ create-static-page.dto.ts
   │  │  │  │  └─ update-static-page.dto.ts
   │  │  │  ├─ entities
   │  │  │  │  └─ static-page.entity.ts
   │  │  │  ├─ static-pages.controller.ts
   │  │  │  ├─ static-pages.module.ts
   │  │  │  └─ static-pages.service.ts
   │  │  ├─ user-identities
   │  │  │  ├─ dto
   │  │  │  │  ├─ create-user-identity.dto.ts
   │  │  │  │  ├─ query-user-identity.dto.ts
   │  │  │  │  ├─ update-user-identity.dto.ts
   │  │  │  │  └─ user-identity-response.dto.ts
   │  │  │  ├─ entities
   │  │  │  │  └─ user-identity.entity.ts
   │  │  │  ├─ user-identities.controller.ts
   │  │  │  ├─ user-identities.module.ts
   │  │  │  └─ user-identities.service.ts
   │  │  └─ users
   │  │     ├─ dto
   │  │     │  ├─ create-user.dto.ts
   │  │     │  ├─ query-user.dto.ts
   │  │     │  ├─ update-user.dto.ts
   │  │     │  └─ user-response.dto.ts
   │  │     ├─ entities
   │  │     │  └─ user.entity.ts
   │  │     ├─ users.controller.ts
   │  │     ├─ users.md
   │  │     ├─ users.module.ts
   │  │     └─ users.service.ts
   │  ├─ src.md
   │  ├─ swagger
   │  │  ├─ swagger.config.ts
   │  │  └─ swagger.md
   │  ├─ utils
   │  │  ├─ response.util.ts
   │  │  └─ utils.md
   │  └─ validators
   │     ├─ uuid.validator.ts
   │     └─ validators.md
   ├─ tsconfig.build.json
   └─ tsconfig.json

```