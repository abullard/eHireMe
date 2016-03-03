//
//  EHMJobs.m
//  eHireMe-iOS
//
//  Created by Mac Liu on 3/1/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import "EHMJobs.h"

@implementation EHMJobs

- (id)initWithDictionary:(NSDictionary *)dictionary {
    self = [super init];
    
    if (self) {
        self.company = [dictionary objectForKey:@"company_name"];
        self.employerId = [dictionary objectForKey:@"employer_id"];
        self.desc = [dictionary objectForKey:@"description"];
        self.type = [dictionary objectForKey:@"type"];
        self.payRate = [dictionary objectForKey:@"hourly_rate"];
    }
    
    return self;
}

@end
