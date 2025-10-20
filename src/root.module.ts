import { Module } from "@nestjs/common";
import { ProductCatalogModule } from "./product-catalog/product-catalog.module";

// モジュラーモノリスのため、複数のUsecaseとModuleの依存関係をはっきりさせるためにRootModuleを用意する
@Module({
    imports: [ProductCatalogModule],
    controllers: [],
    providers: [],
    exports: []
})
export class RootModule {}
