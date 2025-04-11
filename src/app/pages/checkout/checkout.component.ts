import { CartService } from './../../core/services/cart/cart.service';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { AddressesService } from '../../core/services/addresses/addresses.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { IAddress } from '../../shared/interfaces/iaddress';
import { CurrencyPipe, NgClass } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from '../../core/services/orders/orders.service';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-checkout',
  imports: [
    TextareaModule,
    SelectButtonModule,
    FloatLabelModule,
    DropdownModule,
    DataViewModule,
    DialogModule,
    ButtonModule,
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyPipe,
    BreadcrumbModule,
    RouterLink,
    NgClass,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  private readonly addressesService = inject(AddressesService);
  private readonly formBuilder = inject(FormBuilder);
  readonly cartService = inject(CartService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly toastrService = inject(ToastrService);
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);
  allUserAddress: IAddress[] = [];
  data: object = {};
  visible: WritableSignal<boolean> = signal(false);
  selectedCountry: any;
  selectedState: any;
  countries: object[] = [];
  stateOptions: object[] = [];
  value: string = 'Home';
  removeLoading: { [key: string]: WritableSignal<boolean> } = {};
  specificAddresses: IAddress = {} as IAddress;
  shippingAddress: object = {};
  estimatedEndDate: WritableSignal<string> = signal('');
  paymentMethod: WritableSignal<string> = signal('onlinePayment');
  checkLoading: WritableSignal<boolean> = signal(false);
  shipmentMethod: WritableSignal<string> = signal('Free');
  today: Date = new Date();
  links: MenuItem[] | undefined;

  addressForm: FormGroup = this.formBuilder.group({
    name: [null, [Validators.required]],
    details: [null, [Validators.required]],
    phone: [
      null,
      [Validators.required, Validators.pattern(/^01(0|1|2|5)\d{8}$/)],
    ],
    city: [null, [Validators.required]],
  });

  ngOnInit() {
    this.initializeData();
  }

  initializeData(): void {
    this.links = [
      { label: 'Home', route: '/home' },
      { label: 'Category', route: '/products' },
      { label: 'Cart', route: '/products/cart' },
      { label: 'Checkout' },
    ];

    this.countries = [
      {
        name: 'United States',
        code: 'US',
        flag: 'https://flagcdn.com/w40/us.png',
        states: [
          { name: 'California' },
          { name: 'Texas' },
          { name: 'Florida' },
          { name: 'New York' },
          { name: 'Illinois' },
          { name: 'Pennsylvania' },
          { name: 'Ohio' },
          { name: 'Georgia' },
          { name: 'North Carolina' },
          { name: 'Michigan' },
        ],
      },
      {
        name: 'Germany',
        code: 'DE',
        flag: 'https://flagcdn.com/w40/de.png',
        states: [
          { name: 'Berlin' },
          { name: 'Bavaria' },
          { name: 'Hamburg' },
          { name: 'Saxony' },
          { name: 'Hesse' },
          { name: 'Baden-Württemberg' },
          { name: 'Lower Saxony' },
        ],
      },
      {
        name: 'Italy',
        code: 'IT',
        flag: 'https://flagcdn.com/w40/it.png',
        states: [
          { name: 'Rome' },
          { name: 'Milan' },
          { name: 'Naples' },
          { name: 'Turin' },
          { name: 'Palermo' },
          { name: 'Genoa' },
          { name: 'Florence' },
        ],
      },
      {
        name: 'China',
        code: 'CN',
        flag: 'https://flagcdn.com/w40/cn.png',
        states: [
          { name: 'Beijing' },
          { name: 'Shanghai' },
          { name: 'Guangzhou' },
          { name: 'Shenzhen' },
          { name: 'Tianjin' },
          { name: 'Chongqing' },
          { name: 'Wuhan' },
        ],
      },
      {
        name: 'Spain',
        code: 'ES',
        flag: 'https://flagcdn.com/w40/es.png',
        states: [
          { name: 'Madrid' },
          { name: 'Barcelona' },
          { name: 'Valencia' },
          { name: 'Seville' },
          { name: 'Bilbao' },
          { name: 'Malaga' },
          { name: 'Zaragoza' },
        ],
      },
      {
        name: 'United Kingdom',
        code: 'GB',
        flag: 'https://flagcdn.com/w40/gb.png',
        states: [
          { name: 'London' },
          { name: 'Manchester' },
          { name: 'Birmingham' },
          { name: 'Liverpool' },
          { name: 'Leeds' },
          { name: 'Glasgow' },
          { name: 'Edinburgh' },
        ],
      },
      {
        name: 'Saudi Arabia',
        code: 'SA',
        flag: 'https://flagcdn.com/w40/sa.png',
        states: [
          { name: 'Riyadh' },
          { name: 'Jeddah' },
          { name: 'Mecca' },
          { name: 'Medina' },
          { name: 'Dammam' },
          { name: 'Abha' },
          { name: 'Tabuk' },
          { name: 'Al Khobar' },
          { name: 'Hail' },
          { name: 'Buraidah' },
        ],
      },
      {
        name: 'Egypt',
        code: 'EG',
        flag: 'https://flagcdn.com/w40/eg.png',
        states: [
          { name: 'Cairo' },
          { name: 'Alexandria' },
          { name: 'Giza' },
          { name: 'Port Said' },
          { name: 'Suez' },
          { name: 'Luxor' },
          { name: 'Aswan' },
          { name: 'Mansoura' },
          { name: 'Tanta' },
          { name: 'Ismailia' },
          { name: 'Zagazig' },
          { name: 'Fayoum' },
          { name: 'Beni Suef' },
          { name: 'Sohag' },
          { name: 'Minya' },
          { name: 'Damietta' },
          { name: 'Shibin El Kom' },
          { name: 'Qena' },
          { name: 'Asyut' },
        ],
      },
      {
        name: 'Algeria',
        code: 'DZ',
        flag: 'https://flagcdn.com/w40/dz.png',
        states: [
          { name: 'Algiers' },
          { name: 'Oran' },
          { name: 'Constantine' },
          { name: 'Annaba' },
          { name: 'Blida' },
          { name: 'Batna' },
          { name: 'Tlemcen' },
        ],
      },
      {
        name: 'Morocco',
        code: 'MA',
        flag: 'https://flagcdn.com/w40/ma.png',
        states: [
          { name: 'Rabat' },
          { name: 'Casablanca' },
          { name: 'Marrakech' },
          { name: 'Fes' },
          { name: 'Tangier' },
          { name: 'Agadir' },
          { name: 'Meknes' },
        ],
      },
      {
        name: 'United Arab Emirates',
        code: 'AE',
        flag: 'https://flagcdn.com/w40/ae.png',
        states: [
          { name: 'Abu Dhabi' },
          { name: 'Dubai' },
          { name: 'Sharjah' },
          { name: 'Ajman' },
          { name: 'Fujairah' },
          { name: 'Ras Al Khaimah' },
          { name: 'Umm Al Quwain' },
        ],
      },
      {
        name: 'Iraq',
        code: 'IQ',
        flag: 'https://flagcdn.com/w40/iq.png',
        states: [
          { name: 'Baghdad' },
          { name: 'Basra' },
          { name: 'Mosul' },
          { name: 'Erbil' },
          { name: 'Najaf' },
          { name: 'Karbala' },
          { name: 'Sulaymaniyah' },
        ],
      },
      {
        name: 'Jordan',
        code: 'JO',
        flag: 'https://flagcdn.com/w40/jo.png',
        states: [
          { name: 'Amman' },
          { name: 'Zarqa' },
          { name: 'Irbid' },
          { name: 'Aqaba' },
          { name: 'Madaba' },
          { name: 'Jerash' },
          { name: 'Ajloun' },
        ],
      },
      {
        name: 'Lebanon',
        code: 'LB',
        flag: 'https://flagcdn.com/w40/lb.png',
        states: [
          { name: 'Beirut' },
          { name: 'Tripoli' },
          { name: 'Sidon' },
          { name: 'Zahle' },
          { name: 'Byblos' },
          { name: 'Tyre' },
          { name: 'Baalbek' },
        ],
      },
    ];
    this.stateOptions = [
      { label: 'Home', value: 'Home' },
      { label: 'Office', value: 'Office' },
    ];
    this.getAllUserAddress();
    this.calculateDeliveryDates();
  }

  addUaerAdress(): void {
    this.addressesService.addAddress(this.data).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getAllUserAddress(): void {
    this.addressesService.getLoggedUserAddresses().subscribe({
      next: (res) => {
        console.log(res);
        this.allUserAddress = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  removeAddress(id: string): void {
    this.removeLoading[id] = signal(true);

    this.addressesService.removeAddress(id).subscribe({
      next: (res) => {
        console.log(res);
        this.allUserAddress = res.data;
        this.removeLoading[id] = signal(false);
      },
      error: (err) => {
        console.log(err);
        this.removeLoading[id] = signal(false);
      },
    });
  }

  submitFromAddress(): void {
    const formValue = this.addressForm.value;
    const formattedData = {
      name: formValue.name,
      details: formValue.details,
      phone: formValue.phone,
      city: formValue.city?.name || formValue.city,
    };

    this.addressesService.addAddress(formattedData).subscribe({
      next: (res) => {
        console.log(res);
        this.allUserAddress = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getSpecificAddresses(id: string) {
    this.specificAddresses = this.allUserAddress.find(
      (address) => address._id === id
    ) as IAddress;
    console.log(this.specificAddresses);
  }

  getShipmentMethod(shipmentMethod: string): void {
    if (shipmentMethod === 'regular') {
      this.shipmentMethod.set('free');
    } else {
      this.shipmentMethod.set('100 EGP');
    }
  }

  getPaymentMethod(method: string): void {
    if (method === 'onlinePayment') {
      this.paymentMethod.set('onlinePayment');
      console.log(this.paymentMethod());
    } else {
      this.paymentMethod.set('cashOrder');
      console.log(this.paymentMethod());
    }
  }

  placeOrder(): void {
    if (
      !this.specificAddresses ||
      Object.keys(this.specificAddresses).length === 0
    ) {
      this.toastrService.error(
        'Please select a shipping address before placing an order.',
        'Error'
      );
      return;
    }

    this.shippingAddress = {
      details: this.specificAddresses.details,
      phone: this.specificAddresses.phone,
      city: this.specificAddresses.city,
    };

    this.checkLoading.set(true);
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        let id = params.get('id')!;
        console.log(id);

        if (!id) {
          this.toastrService.error(
            'There Is No Cart For This User Or Cart Is Empty',
            'CardID'
          );
        } else {
          if (this.paymentMethod() === 'onlinePayment') {
            this.ordersService
              .createOnlineOrder(id, this.shippingAddress)
              .subscribe({
                next: (res) => {
                  console.log(res);
                  if (res.status === 'success') {
                    open(res.session.url, '_self');
                  }
                  this.checkLoading.set(false);
                },
                error: (err) => {
                  console.log(err);
                  this.checkLoading.set(false);
                },
              });
          } else {
            this.ordersService
              .createCashOrder(id, this.shippingAddress)
              .subscribe({
                next: (res) => {
                  if ((res.status = 'success')) {
                    this.router.navigate(['/allorders']);
                  }
                  this.checkLoading.set(false);
                },
                error: (err) => {
                  console.log(err);
                  this.checkLoading.set(false);
                },
              });
          }
        }
      },
      error: (err) => {
        console.log(err);
        this.checkLoading.set(false);
      },
    });
  }

  showDialog() {
    this.visible.set(true);
  }

  calculateDeliveryDates() {
    const startDate = new Date(this.today);
    startDate.setDate(this.today.getDate() + 2);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2);
    this.estimatedEndDate.set(this.formatDate(endDate));
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
