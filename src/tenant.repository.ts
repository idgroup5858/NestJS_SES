// common/tenant.repository.ts
import { Repository, ObjectLiteral } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { UnauthorizedException } from '@nestjs/common';

export class TenantRepository<T extends ObjectLiteral> {
  constructor(
    protected repo: Repository<T>,
    protected cls: ClsService,
  ) {}

  protected get companyId(): number {
    const id = this.cls.get('company_id'); // <-- sizning validate() dan keladi
    console.log(id);
    console.log("axaxaxa");
    
    
    if (!id) {
      throw new UnauthorizedException('companyId topilmadi — token tekshiring');
    }
    return id;
  }

  find(options: any = {}) {
    return this.repo.find({
      ...options,
      where: { ...options.where, company_id: this.companyId },
    });
  }

  findOne(options: any = {}) {
    return this.repo.findOne({
      ...options,
      where: { ...options.where, company_id: this.companyId },
    });
  }

  save(data: any) {
    return this.repo.save({ ...data, company_id: this.companyId });
  }

  delete(id: number) {
    return this.repo.delete({ id, company_id: this.companyId } as any);
  }
}