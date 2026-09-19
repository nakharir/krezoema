import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsContent, TabsTrigger } from './ui/tabs';
import axios from 'axios';
import { apiEndpoints } from '@/app/api/api';
import { Button } from './ui/button';

interface NavbarProduct {
  id: number;
  kode: string;
  kode_main_navbar: string;
  nama: string;
  link_to: string;
  sidebar_products: SidebarProduct[];
}

interface SidebarProduct {
  id: number;
  kode: string;
  kode_navbar_product: string;
  name: string;
  content_products: ContentProduct[];
}

interface ContentProduct {
  id: number;
  kode: string;
  kode_sidebar_product: string;
  nama: string;
  gambar: string;
  link_to: string;
  deskripsi: string;
}

export default function NavbarProduct() {
  const [content, setContent] = useState<NavbarProduct[]>([]);
  const [selectedSidebar, setSelectedSidebar] = useState<string>('');

  useEffect(() => {
    axios
      .get((apiEndpoints as any).allContent || "")
      .then((response) => {
        setContent(response.data);
        console.log(response.data);
        // Set the first sidebar as selected by default, if available
        if (response.data.length > 0 && response.data[0].sidebar_products.length > 0) {
          setSelectedSidebar(response.data[0].sidebar_products[0].kode);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="w-full h-full">
      <Tabs defaultValue={content.length > 0 ? content[0].kode : ''} className="w-full h-full">
        <TabsList className="w-full h-[55px] pl-[45px] bg-gray-200">
          {content.map((contentItem) => (
            <TabsTrigger
              className="text-[16px] animate-fade-in duration-200"
              value={contentItem.kode}
              key={contentItem.kode}
            >
              {contentItem.nama}
            </TabsTrigger>
          ))}
        </TabsList>

        {content.map((contentItem) => (
          <TabsContent
            value={contentItem.kode}
            key={contentItem.kode}
            className="m-0 w-full h-full"
          >
            {contentItem.nama === 'Aplikasi' ? (
              <div className="h-full w-full flex flex-row">
                <div className="w-[280px] h-full border-r-[2px] mr-[26px] mt-[54px]">
                  <div className="h-full w-full flex flex-col ">
                    {contentItem.sidebar_products.map((sidebarProduct) => (
                      <Button
                        key={sidebarProduct.kode}
                        className={`w-full text-[16px] poppins-medium justify-start ${
                          selectedSidebar === sidebarProduct.kode ? 'text-green-600' : 'hover:text-green-600'
                        }`}
                        variant="ghost"
                        onClick={() => setSelectedSidebar(sidebarProduct.kode)}
                      >
                        {sidebarProduct.name}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className='w-full h-full mt-[18px]'>
                  {contentItem.sidebar_products.map((sidebarProduct) => (
                    sidebarProduct.kode === selectedSidebar && (
                      <div key={sidebarProduct.kode} className='w-full h-full flex flex-col pl-10'>
                        <div className='text-[24px] poppins-bold mb-6'>
                          {sidebarProduct.name}
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                          {sidebarProduct.content_products.map((contentProduct) => (
                            <div key={contentProduct.kode} className='bg-white rounded-lg shadow-md p-4'>
                              <h3 className='text-[20px] poppins-semibold mb-2'>{contentProduct.nama}</h3>
                              <img src={contentProduct.gambar} alt={contentProduct.nama} className='w-full h-40 object-cover mb-2 rounded' />
                              <p className='text-sm text-gray-600 mb-4'>{contentProduct.deskripsi}</p>
                              <a href={contentProduct.link_to} className='text-blue-500 hover:underline'>Learn More</a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full w-full p-6">
                <h2 className="text-2xl font-bold mb-4">{contentItem.nama}</h2>
                <p>Content for {contentItem.nama} goes here.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}