import React from 'react';
import LoadingIcon from '../loading_icon';
import { withRouter, Link } from 'react-router-dom';

class ShopShow extends React.Component {
    constructor() {
        super();
        this.handleEdit = this.handleEdit.bind(this);
        this.handleStock = this.handleStock.bind(this);
        this.toProductPage = this.toProductPage.bind(this);
        // this.editDeleteButton = this.editDeleteButton.bind(this);
    }

    componentDidMount() {
        this.props.fetchShop(this.props.match.params.shopId);
        this.props.fetchProducts(this.props.match.params.shopId);
    };

    componentDidUpdate(prevProps) {
        if (this.props.match.params.shopId !== prevProps.match.params.shopId) {
            this.props.fetchShop(this.props.match.params.shopId);
            this.props.fetchProducts(this.props.match.params.shopId);
        }
    }

    handleEdit(event){
        event.preventDefault();
        this.props.history.push(`/shops/${this.props.shop.id}/edit`);  
    }

    handleStock(event){
        event.preventDefault();
        this.props.history.push(`/shops/${this.props.shop.id}/products/new`);   
    }

    toProductPage(productId){
        return (event) => {
            event.preventDefault();
            this.props.history.push(`/shops/${this.props.shop.id}/products/${productId}`)
        }
    }

    editDeleteButton(product){
        let { shop, currentUserId, deleteProduct } = this.props;
        let editDeleteButton;
        if (currentUserId === shop.owner.id) {
            editDeleteButton = (
                <div className="edit-delete-button">
                    <Link to={`/products/${product.id}/edit`}>Edit item</Link>
                    <button onClick={() => deleteProduct(product.id)}>Delete me</button>
                </div>
            );
        };
        return editDeleteButton;
    }

    render() {
        let { shop, currentUserId, products } = this.props;
        if (!shop || !products) {
            return (
                <LoadingIcon />
            )
        }
        let stockItemButton;
        if ( currentUserId === shop.owner.id ){
            stockItemButton = (
                <div className="stock-edit-button">
                    <button className="clicky stock-your-shop-button" onClick={this.handleStock}>
                        Stock your shop
                    </button>

                    <button className="clicky edit-your-shop-button" onClick={this.handleEdit}>
                        Edit your shop
                    </button>
                </div>
                
            );
        } else {
            stockItemButton = '';
        };

        

        const productLi = products.map(product => {
            return (
                <li key={product.id}>
                    <div onClick={this.toProductPage(product.id)}>
                        <img src={product.imageUrl} />
                        <p className="product-title">{product.title.slice(0, 27)}...</p>
                        <p><strong>USD {product.price}</strong></p>
                    </div>
                    
                    {this.editDeleteButton(product)}
                </li>
            )
        });

        return (
            <div className="shop-show">
                <div className="shop-show-header">
                    <div className="shop-logo">
                        <img src={shop.imageUrl} />
                        {stockItemButton}
                    </div>

                    <div className="shop-info">
                        <div className="shop-name-show">
                            {shop.name}
                        </div>
                        <div className="favorite-shop">
                            <i className="fa fa-heart-o" aria-hidden="true"></i>
                            Favorite shop ({shop.users_who_favorited_me.length})
                        </div>
                        
                    </div>

                    <div className="owner-info">
                        <p>Shop owner</p>
                        <img src={shop.profilePicUrl} />
                        <div className="shop-owner-name">{shop.owner.fname}</div>
                        <div className="shop-owner-email">
                            <i className="fa fa-envelope-o" aria-hidden="true"></i>
                            {shop.owner.email}
                        </div>
                    </div>
                    
                </div>

                <div className="products-listing">
                    <label>All items</label>
                    <ul>
                        {productLi}
                    </ul>
                </div>

                {/* show products sold by this shop */}
                {/* can insert reviews too */}

            </div>
        );
    };
}

export default withRouter(ShopShow);