import { Directive, HostBinding, inject,} from '@angular/core';
import { ApiService } from 'src/app/shared/services';

@Directive({
  selector: '[requireApiKey]',
  standalone: true,
})
export class RequireApiKeyDirective {
  private readonly apiService = inject(ApiService);

  @HostBinding('class.hidden')
  public get hidden() {
    return !this.apiService.hasApiKey();
  }
}
