//
//  EHMApi.h
//  eHireMe-iOS
//
//  Created by Mac Liu on 2/19/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "EHMApplicant.h"

@interface EHMApi : NSObject

-(EHMApplicant *)loginInApplicantForEmail:(NSString *)email password:(NSString *)password;

@end
