'use client'
import React, { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

const navigation = [
  { name: 'Generate QR', href: '/generate-qr' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '#about' }
]

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <header className='absolute inset-x-0 top-0 z-50'>
      <nav
        aria-label='Global'
        className='mx-auto flex items-center justify-between p-4 lg:px-8'
      >
        <div className='flex flex-1'>
          <a href='/' className='p-1.5'>
            <Image
              width={250}
              height={24}
              alt='QR Code Generator Logo'
              src='/qr_logo.png'
              className='h-8 w-auto sm:h-10'
              priority
            />
          </a>
        </div>
        <div className='flex md:hidden'>
          <button
            type='button'
            onClick={() => setMobileMenuOpen(true)}
            className='inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
          >
            <span className='sr-only'>Open main menu</span>
            <Bars3Icon className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
        <div className='hidden md:flex md:gap-x-8 md:items-center'>
          {navigation.map(item => (
            <a
              key={item.name}
              href={item.href}
              className='text-sm font-semibold text-gray-900 hover:text-gray-600'
            >
              {item.name}
            </a>
          ))}
          <a
            href='#'
            className='text-sm font-semibold text-gray-900 hover:text-gray-600'
          >
            Try Pro <span aria-hidden='true'>&rarr;</span>
          </a>
        </div>
      </nav>
      <Dialog
        as='div'
        className='md:hidden'
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className='fixed inset-0 z-50 bg-black/30' aria-hidden='true' />
        <DialogPanel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
          <div className='flex items-center justify-between'>
            <a href='/' className='-m-1.5 p-1.5'>
              <span className='sr-only'>QR Code Generator</span>
              <Image
                width={250}
                height={24}
                alt='QR Code Generator Logo'
                src='/qr_logo.png'
                className='h-8 w-auto'
                priority
              />
            </a>
            <button
              type='button'
              className='rounded-md p-2.5 text-gray-700'
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className='sr-only'>Close menu</span>
              <XMarkIcon className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='mt-6 flow-root'>
            <div className='-my-6 divide-y divide-gray-500/10'>
              <div className='space-y-2 py-6'>
                {navigation.map(item => (
                  <a
                    key={item.name}
                    href={item.href}
                    className='block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className='py-6'>
                <a
                  href='#'
                  className='block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Try Pro
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}

export default Navbar
