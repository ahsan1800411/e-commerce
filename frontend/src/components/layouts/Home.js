import React, { useEffect, useState } from 'react';
import MetaData from './MetaData';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../../actions/productActions';
import Product from './product/Product';
import Loader from './Loader';
import { useAlert } from 'react-alert';
import Pagination from 'react-js-pagination';
import { useParams } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]);
  const { keyword } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error, resPerPage, productsCount } = useSelector(
    (state) => state.products
  );

  const alert = useAlert();

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }

    dispatch(getProducts(keyword, currentPage, price));
  }, [dispatch, error, alert, keyword, currentPage, price]);

  function setCurrentPageNo(pageNumber) {
    setCurrentPage(pageNumber);
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={'Buy Best Products Online -ShopIT'} />
          <h1 id='products_heading'>Latest Products</h1>

          <section id='products' className='container mt-5'>
            <div className='row'>
              {keyword ? (
                <>
                  <div className='col-6 col-md-3 mt-5 mb-5'>
                    <div className='px-5'>
                      <Range
                        marks={{
                          1: `$1`,
                          1000: `$1000`,
                        }}
                        min={1}
                        max={1000}
                        defaultValue={[1, 1000]}
                        tipFormatter={(value) => `$${value}`}
                        tipProps={{
                          placement: 'top',
                          visible: true,
                        }}
                        value={price}
                        onChange={(price) => setPrice(price)}
                      />
                    </div>
                  </div>
                  <div className='col-6 col-md-9'>
                    <div className='row'>
                      {products &&
                        products.map((product) => (
                          <Product
                            key={product._id}
                            product={product}
                            col={4}
                          />
                        ))}
                    </div>
                  </div>
                </>
              ) : (
                products &&
                products.map((product) => (
                  <Product key={product._id} product={product} col={3} />
                ))
              )}
            </div>
          </section>
          {resPerPage <= productsCount && (
            <div className='d-flex justify-content-center mt-5'>
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                prevPageText={'Prev'}
                nextPageText={'Next'}
                firstPageText={'First'}
                lastPageText={'Last'}
                itemClass='page-item'
                linkClass='page-link'
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Home;
